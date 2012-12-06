(function(){var NONCHARACTER_KEYS={8:"Backspace",9:"Tab",13:"Return",16:"Shift",17:"Control",18:"Alt",27:"Esc",32:"Spacebar",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"Left",38:"Up",39:"Right",40:"Down",46:"Del"};var MODIFIER_KEYS={16:"Shift",17:"Control",18:"Alt"};var lastModifierKey=0;pipe("keydown",function(event){if(event.which in MODIFIER_KEYS){if(event.which===lastModifierKey){return null}lastModifierKey=event.which}else{lastModifierKey=0}return NONCHARACTER_KEYS[event.which]||null},"aui:keydown");pipe("keypress",function(event){lastModifierKey=0;switch(event.which){case 0:case 8:case 9:case 27:break;default:if(!event.ctrlKey&&!event.altKey&&!event.metaKey){return String.fromCharCode(event.which)}}return null},"aui:keypress");pipe("keyup",function(event){if(event.which===lastModifierKey){lastModifierKey=0}return NONCHARACTER_KEYS[event.which]||null},"aui:keyup");function pipe(inType,getKey,outType){var listenerCount=0;jQuery.event.special[outType]={setup:function(){if(listenerCount===0){jQuery(document).bind(inType,dispatchKeyEvent)}listenerCount++},teardown:function(){listenerCount--;if(listenerCount===0){jQuery(document).unbind(inType,dispatchKeyEvent)}}};function dispatchKeyEvent(event){var key=getKey(event);if(key){var $event=new jQuery.Event(outType);$event.key=key;if(outType!=="aui:keypress"){$event.shiftKey=event.shiftKey;$event.ctrlKey=event.ctrlKey;$event.altKey=event.altKey}var target=event.target;var ownerDocument=(target.nodeType===9)?target:target.ownerDocument;if(ownerDocument!==document){$event.target=target;arguments[0]=$event;jQuery.event.trigger($event,arguments,document,true)}else{jQuery(target).trigger($event)}if($event.isDefaultPrevented()){event.preventDefault()}}}}jQuery(document).bind("iframeAppended",function(event){jQuery(event.target).contents().bind("keydown keypress keyup",function(event){jQuery.event.trigger(event,arguments,document,true)})})})();