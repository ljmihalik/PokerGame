EBG.declareNamespace("Modules.Delayedimpression");EBG.Modules.DelayedImpression=function (adConfig){this.ad=EBG.ads[adConfig.uid];this._init();};EBG.Modules.DelayedImpression.prototype={_ad:null,_init:function (){this.ad._clearDelayedImpData=function (){this._adConfig.delayedImpParams=null;};this.ad._handleDelayedImpressionReport=function (){if(this._adConfig.delayedImpParams){this._reportImpression();this._clearDelayedImpData();}if(this._adConfig.impressionTrackingURLs){this._reportImpressionTrackingURLs(this._adConfig.impressionTrackingURLs);}EBG.intMgr.allowInteractionReport(this._adConfig.uid);};this.ad._reportImpression=function (isBlank){var webPageSource=(EBGInfra.isDefined(this._adConfig.page)&&this._adConfig.page!="")?1:0;var forceDisplay=(EBG.isPreview)?1:0;var request=EBG.format("{0}{1}/{2}/adServer.bs?cn=display&code=10&PluID={3}&EyeblasterID={4}&Page={5}&WebPageSource={6}&ForceDisplay={7}&Resolution={8}&sessionid={9}&Optout={10}&usercookie={11}",EBG.protocol,this._adConfig.bsPath,this._adConfig.appPool,this._adConfig.pluId,this._adConfig.adId,this._adConfig.page,webPageSource,forceDisplay,EBG.adaptor.getResolution(),this._adConfig.sID,this._adConfig.optOut,this._adConfig.usercookie);if(this._adConfig.delayedImpParams){request+=this._adConfig.delayedImpParams;}if(isBlank){request+="&isBlank=1";}if(EBG.adaptor.flash){request+="&FlashVersion="+EBG.adaptor.flash.version;}if(this._adConfig.massVersioning.targetAudienceId){request+="&ta="+this._adConfig.massVersioning.targetAudienceId;}if(this._adConfig.massVersioning.deliveryGroupId){request+="&dg="+this._adConfig.massVersioning.deliveryGroupId;}if(this._adConfig.massVersioning.subDeliveryGroupId){request+="&sdg="+this._adConfig.massVersioning.subDeliveryGroupId;}if(this._adConfig.defaultImageDisplayed){request+="&di=1";}if(this._adConfig.defaultImageReason){request+="&dir="+this._adConfig.defaultImageReason;}if(this._adConfig.massVersioning.adVersions){request+="&vid="+this._removePrefixFromVersions();}if(EBGInfra.isDefinedNotNull(this._adConfig.diAppId)){request+="&diappid="+this._adConfig.diAppId;}request+="&ord="+Math.random();EBG.adaptor.reportToRemoteServer(request,true);};}};var event=new EBG.Events.Event(EBG.Events.EventNames.MODULE_LOAD);event.eventData={moduleName:"DelayedImpression"};EBG.eventMgr.dispatchEvent(event);