JIRA.Mention=AJS.Control.extend({CLASS_SIGNATURE:"AJS_MENTION",listening:false,init:function(){var instance=this;this.$suggestions=jQuery("<div />");this.contentRetreiver=new AJS.AjaxContentRetriever(function(){var params=instance._getQueryParams();return{url:contextPath+"/rest/api/2/user/viewissue/search",data:params,formatSuccess:function(data){return instance.generateSuggestions(data)},cache:false,requestDelay:100}});this.listController=new AJS.MentionGroup()},_getQueryParams:function(){var queryParams=this.restParams;queryParams.username=this._getCurrentUserName();return queryParams},_setQueryParams:function(){var params={issueKey:this.$textarea.attr("data-issuekey"),projectKey:this.$textarea.attr("data-projectkey"),maxResults:10};if(JIRA.Dialog.current&&JIRA.Dialog.current.options.id==="create-issue-dialog"){delete params.issueKey}this.restParams=params},textarea:function(textarea){var instance=this;if(textarea){this.$textarea=AJS.$(textarea);AJS.$("#mentionDropDown").remove();this.layerController=new AJS.InlineLayer({offsetTarget:this.textarea(),contentRetriever:this.contentRetreiver,allowDownsize:true,width:function(){return instance.$textarea.width()}});this.layerController.bind("showLayer",function(){instance.listController.trigger("focus")}).bind("hideLayer",function(){instance.listController.trigger("blur")}).bind("contentChanged",function(){instance.listController.shiftFocus(0)}).bind("setLayerPosition",function(event,positioning){if(JIRA.Dialog.current&&JIRA.Dialog.current.$form){var buttonRow=JIRA.Dialog.current.$popup.find(".buttons-container:visible");if(buttonRow.length&&positioning.top>buttonRow.offset().top){positioning.top=buttonRow.offset().top}}});this.layerController.layer().attr("id","mentionDropDown");this._assignEvents("textarea",instance.$textarea);this._setQueryParams()}else{return this.$textarea}},generateSuggestions:function(data){var instance=this,$suggestions,username=this._getCurrentUserName();if(!username){return }var regex=new RegExp("(^|.*?(\\s+|\\())("+RegExp.escape(username)+")(.*)","i");function highlight(text){var result={text:text};if(text.toLowerCase().indexOf(username.toLowerCase())>-1){text.replace(regex,function(_,prefix,spaceOrParenthesis,match,suffix){result={prefix:prefix,match:match,suffix:suffix}})}return result}this.listController.removeAllItems();for(var i=0;i<data.length;i++){data[i].username=data[i].name;data[i].emailAddress=highlight(data[i].emailAddress);data[i].displayName=highlight(data[i].displayName);data[i].name=highlight(data[i].name)}$suggestions=AJS.$(JIRA.Templates.mentionsSuggestions({suggestions:data,hasSuggestions:data&&data.length}));$suggestions.find("li").each(function(){var li=AJS.$(this);li.click(function(event){instance._acceptSuggestion(li);event.preventDefault()});instance.listController.addItem(new AJS.Dropdown.ListItem({element:this,autoScroll:true}))});this.listController.prepareForInput();return $suggestions},_acceptSuggestion:function(li){this._hide();this._replaceCurrentUserName(li.find("a").attr("rel"));this.listController.removeAllItems()},_replaceCurrentUserName:function(selectedUserName){var value=this.$textarea.val(),caretPos=this._getCaretPosition(),beforeCaret=value.substr(0,caretPos),wordStartIndex=JIRA.Mention.Matcher.getLastWordBoundaryIndex(beforeCaret,true);this.$textarea.val([value.substr(0,wordStartIndex+1),"[~",selectedUserName,"]",value.substr(caretPos)].join(""));this._setCursorPosition((wordStartIndex+4)+selectedUserName.length)},_setCursorPosition:function(index){var input=this.$textarea.get(0);if(input.setSelectionRange){input.focus();input.setSelectionRange(index,index)}else{if(input.createTextRange){var range=input.createTextRange();range.collapse(true);range.moveEnd("character",index);range.moveStart("character",index);range.select()}}},_getCaretPosition:function(){var element=this.$textarea.get(0);if(typeof element.selectionStart=="number"){return element.selectionStart}else{if(document.selection&&element.createTextRange){var range=document.selection.createRange(),start=this.$textarea.val().length;if(range&&range.parentElement()==element){var len=element.value.length,normalizedValue=element.value.replace(/\r\n/g,"\n"),textInputRange=element.createTextRange();textInputRange.moveToBookmark(range.getBookmark());var endRange=element.createTextRange();endRange.collapse(false);if(textInputRange.compareEndPoints("StartToEnd",endRange)>-1){start=len}else{start=-textInputRange.moveStart("character",-len);start+=normalizedValue.slice(0,start).split("\n").length-1}}return start}}},fetchUserNames:function(){if(this.layerController.isVisible()){this.layerController.refreshContent()}else{this._show()}},_getCurrentUserName:function(){return this.currentUserName},_hide:function(){this.layerController.hide()},_show:function(){this.layerController.show()},onEdit:function(){if(this.listening){var instance=this;this.$textarea.one("keyup",function(event){instance._keyUp(event)})}else{this._hide()}},_keyUp:function(){if(this.listening){var username=this._getUserNameFromInput(),instance=this;if(username&&username.length>0){instance.fetchUserNames(username)}else{if(this.layerController.isVisible()){this._hide()}}}},_getUserNameFromInput:function(){this.currentUserName=JIRA.Mention.Matcher.getUserNameFromCurrentWord(this.$textarea.val(),this._getCaretPosition());return this.currentUserName},_setListeningState:function(event){var key=event.key,username=this._getCurrentUserName();if(username&&username.length===1&&key==="Backspace"){this._hide()}if(this.listening&&(key==="Return"||key==="]")){this.listening=false}else{if(!this.listening&&key==="@"||key==="["){var caretPos=this._getCaretPosition(),prevChar=this.$textarea.val().charAt(caretPos-1);if(prevChar===""||prevChar===" "||prevChar==="\n"){this.listening=true}}}},_events:{textarea:{"aui:keydown aui:keypress":function(event){this._setListeningState(event);this._handleKeyEvent(event)},"keydown":function(e){if(e.keyCode===jQuery.ui.keyCode.ESCAPE){if(this.layerController.isVisible()){this.listening=false;if(JIRA.Dialog.current){jQuery(AJS).one("Dialog.beforeHide",function(e){e.preventDefault()})}this.$textarea.one("keyup",function(keyUpEvent){if(keyUpEvent.keyCode===jQuery.ui.keyCode.ESCAPE){keyUpEvent.stopPropagation();jQuery(AJS).trigger("Mention.afterHide")}})}if(AJS.$.browser.msie){e.preventDefault()}}},"blur":function(){this.listController.removeAllItems()}}}});JIRA.Mention.Matcher={AT_USERNAME_START_REGEX:/^@(.+)/i,AT_USERNAME_REGEX:/[^\[]@(.+)/i,WIKI_MARKUP_REGEX:/\[[~@]+([^~@]+)/i,getUserNameFromCurrentWord:function(text,caretPosition){var before=text.substr(0,caretPosition),lastWordStartIndex=this.getLastWordBoundaryIndex(before,false);var currentWord=before.substr(lastWordStartIndex);var foundMatch;jQuery.each([this.AT_USERNAME_START_REGEX,this.AT_USERNAME_REGEX,this.WIKI_MARKUP_REGEX],function(i,regex){var match=regex.exec(currentWord);if(match){foundMatch=match[1];return false}});return foundMatch||false},getLastWordBoundaryIndex:function(text,strip){var lastAt=text.lastIndexOf("@"),lastWiki=text.lastIndexOf("[~");if(strip){lastAt=lastAt-1;lastWiki=lastWiki-2}return(lastAt>lastWiki)?lastAt:lastWiki}};