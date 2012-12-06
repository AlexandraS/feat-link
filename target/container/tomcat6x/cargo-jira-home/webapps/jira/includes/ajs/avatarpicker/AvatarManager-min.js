JIRA.AvatarManager=Class.extend({init:function(options){this.store=options.store;this.ownerId=options.ownerId;this.anonymousAvatarId=options.anonymousAvatarId;this.avatarSrcBaseUrl=options.avatarSrcBaseUrl},selectAvatar:function(avatar,options){return this.store.selectAvatar(avatar,options)},getById:function(id){return this.store.getById(id)},destroy:function(avatar,options){this.store.destroy(avatar,options)},update:function(avatar,options){this.store.update(avatar,options)},add:function(avatar,options){this.store._add(avatar,options)},getAllSystemAvatars:function(){return this.store.getAllSystemAvatars()},getAllCustomAvatars:function(){return this.store.getAllCustomAvatars()},getSelectedAvatar:function(){return this.store.getSelectedAvatar()},getAllAvatars:function(){return this.store.getAllAvatars()},getAllAvatarsRenderData:function(size){var i,instance=this,avatars=this.getAllAvatars(),renderData={system:[],custom:[]};for(i=0;i<avatars.system.length;i++){renderData.system.push(instance.getAvatarRenderData(avatars.system[i],size))}for(i=0;i<avatars.custom.length;i++){renderData.custom.push(instance.getAvatarRenderData(avatars.custom[i],size))}return renderData},getAvatarRenderData:function(avatar,size){var data=avatar.toJSON();data.src=this.getAvatarSrc(avatar,size);data.width=size.width;data.height=size.height;return data},refreshStore:function(options){this.store.refresh(options)},getAvatarSrc:function(avatar,size){return this.avatarSrcBaseUrl+"?"+jQuery.param({avatarId:avatar.getId(),ownerId:this.ownerId,size:size.param})},createTemporaryAvatar:function(field,options){this.store.createTemporaryAvatar(field,options)},createAvatarFromTemporary:function(instructions,options){this.store.createAvatarFromTemporary(instructions,options)},getAnonymousAvatarId:function(){return this.anonymousAvatarId}});JIRA.AvatarManager.createProjectAvatarManager=function(options){var store=new JIRA.AvatarStore({restUrl:contextPath+"/rest/api/latest/project/"+options.projectKey+"/avatar",defaultAvatarId:options.defaultAvatarId});return new JIRA.AvatarManager({store:store,ownerId:options.projectId,avatarSrcBaseUrl:contextPath+"/secure/projectavatar"})};JIRA.AvatarManager.createUserAvatarManager=function(options){var store=new JIRA.AvatarStore({restUrl:contextPath+"/rest/api/latest/user/avatar",restParams:{"username":options.username},defaultAvatarId:options.defaultAvatarId});return new JIRA.AvatarManager({store:store,ownerId:options.username,avatarSrcBaseUrl:contextPath+"/secure/useravatar"})};