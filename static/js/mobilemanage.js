/**
 * 管理Manage、轉址以及Storage存取
 *
 */

function MobileManage(){
	var that = this;
	var _baseUrl = '../';
	var _securityCodeUrl = 'mobi/mobileValidateCode.php';

	//管理同样的url 不重复执行
	var _ajaxObj = {};
	//存放 url param
	var _urlParamValue = {};

	//点触Url
	/*var _touClickUrl = '//js.touclick.com/js.touclick?b=68aca137-f3c5-457b-87a4-8a46880b1e66';*/
	window.TouClick = false;

	var _module = false;

	var _loader = false;
	var _userManage = false;
	var _agentManage = false;
	var _bankManage = false;
	var _TPPManage = false;
	var _selfGetManage = false;
	var _signManage = false;
	var _emigratedManage = false;
	var _fightTeamManage = false;
	var _experienceManage = false;

	//方法對應
	var _actions = {
		'common':'common',
		'index':'index',
		'account':'account',
		'fundsManage':'fundsManage',
		'login':'login',
		'register':'register',
		'online800':'online800',
		'forgotPassword':'forgotPassword',
		'preferential':'preferential',
		'selfGet':'selfGet',
		'cooperation':'cooperation',
		'QTGame':'QTGame',
		'NTGame':'NTGame',
		'bbs':'bbs',
		'agent':'agent',
		'agentWithdrawal':'agentWithdrawal',
		'agentHistory':'agentHistory',
		'accountHistory':'accountHistory',
		'email':'email',
		'daily':'daily',
		'MGGame':'MGGame',
		'DTGame':'DTGame',
		'BBINGame':'BBINGame',
		'PNGGame':'PNGGame',
		'EbetAppWebGame':'EbetAppWebGame',
		'XINGame':'XINGame',
		'TTGGame':'TTGGame',
		'SWGame':'SWGame'
	};

	//所有動作對應的網址
	var _urls = {
		'index':'mobile/index.jsp',
		'account':'mobile/account.jsp',
		'fundsManage':'mobile/fundsManage.jsp',
		'login':'mobile/login.jsp',
		'register':'mobile/register.jsp',
		'forgotPassword':'mobile/forgotPassword.jsp',
		'preferential':'mobile/preferential.jsp',
		'selfGet':'mobile/selfGet.jsp',
		'cooperation':'mobile/cooperation.jsp',
		'QTGame':'mobile/app/slotGame.jsp?platform=QT',
		'NTGame':'mobile/app/slotGame.jsp?platform=NT',
		'agent':'mobile/agent.jsp',
		'agentWithdrawal':'mobile/agentWithdrawal.jsp',
		'agentHistory':'mobile/agentHistory.jsp',
		'accountHistory':'mobile/accountHistory.jsp',
		//'bbs':'asp/bbsIndex.php',
		'bbs':'http://wsq.discuz.qq.com/?siteid=265079942&source=wap&c=index&a=index',
		'email':'mobile/email.jsp',
		'daily':'mobile/daily.jsp',
		'DTGame':'mobile/app/slotGame.jsp?platform=DT',
		'BBINGame':'mobile/app/slotGame.jsp?platform=BBIN',
		'PNGGame':'mobile/app/slotGame.jsp?platform=PNG',
		'MGGame':'mobile/app/slotGame.jsp?platform=MGS',
		'online800':'https://chatai.l8servicept777.com/chat/chatClient/chatbox.jsp?companyID=9036&configID=28&jid=&info=',
		'EbetAppWebGame':'gameEbetLoginNew.php',
		'XINGame': 'mobile/app/slotGame.jsp?platform=XIN',
		'TTGGame': 'mobile/app/slotGame.jsp?platform=TTG',
		'SWGame': 'mobile/app/slotGame.jsp?platform=SW'
	};
	//Storage Name
	var _storages = {
		'common':'mobi-common-storage',
		'index':'mobi-index-storage',
		'account':'mobi-account-storage',
		'fundsManage':'mobi-fundsManage-storage',
		'login':'mobi-login-storage',
		'register':'mobi-register-storage',
		'forgotPassword':'mobi-forgotPassword-storage',
		'online800':'mobi-online800-storage',
		'email':'mobi-email-storage',
		'selfGet':'mobi-selfGet-storag',
		'cooperation':'mobi-cooperation-storag',
		'preferential':'mobi-preferential-storage',
		'bbs':'mobi-bbs-storage',
		'agent':'mobi-agent-storage',
		'agentWithdrawal':'mobi-agentWithdrawal-storage',
		'agentHistory':'mobi-agentHistory-storage',
		'accountHistory':'mobi-accountHistory-storage',
		'daily':'mobi-daily-storage'
	};

	//轉址
	that.redirect = function(key,param,target){
		that.setSessionStorage('common',{pageId:key});
		_redirect(key,param,target);
	};
	//Get Object from SessionStorage
	that.getSessionStorage = function(key){
		return getSessionStorage(key);
	};
	//set Object in SessionStorage
	that.setSessionStorage = function(key,param){
		setSessionStorage(key,param);
	};

	//Get Object from Storage
	that.getLocalStorage = function(key){
		return getLocalStorage(key);
	};
	//set Object in Storage
	that.setLocalStorage = function(key,param){
		setLocalStorage(key,param);
	};

	/**
	 * 取得验证码url
	 */
	that.getSecurityCodeUrl = function(){
		return _securityCodeUrl;
	};

	/**
	 *
	 */
	that.getModel = function(){
		if(!_module){
			_module = new MUIModel(that,mui);
		}
		return _module;
	};

	/**
	 * get loader
	 */
	that.getLoader = function(){
		if(!_loader){
			if(!Loader||typeof Loader !== 'function'){
				alert('Loader 加载失败，请重新刷新页面。');
				return;
			}
			_loader = new Loader();
		}
		return _loader;
	};

	/**
	 * get UserManage
	 */
	that.getUserManage = function(){
		if(!_userManage){
			if(!UserManage||typeof UserManage !== 'function'){
				alert('UserManage 加载失败，请重新刷新页面。');
				return;
			}
			_userManage = new UserManage(_baseUrl);
		}
		return _userManage;
	};

	/**
	 *
	 * get AgentManage
	 */
	that.getAgentManage = function(){
		if(!_agentManage){
			if(!AgentManage||typeof AgentManage !== 'function'){
				alert('AgentManage 加载失败，请重新刷新页面。');
				return;
			}
			_agentManage = new AgentManage(_baseUrl);
		}
		return _agentManage;
	};

	/**
	 * get TPPManage
	 */
	that.getTPPManage = function(){
		if(!_TPPManage){
			if(!TPPManage||typeof TPPManage !== 'function'){
				alert('TPPManage 加载失败，请重新刷新页面。');
				return;
			}
			_TPPManage = new TPPManage(_baseUrl);
		}
		return _TPPManage;
	};

	/**
	 * get BankManage
	 */
	that.getBankManage = function(){
		if(!_bankManage){
			if(!BankManage||typeof BankManage !== 'function'){
				alert('BankManage 加载失败，请重新刷新页面。');
				return;
			}
			_bankManage = new BankManage(_baseUrl);
		}
		return _bankManage;
	};

	/**
	 * get SelfGetManage
	 */
	that.getSelfGetManage = function(){
		if(!_selfGetManage){
			if(!SelfGetManage||typeof SelfGetManage !== 'function'){
				alert('BankManage 加载失败，请重新刷新页面。');
				return;
			}
			_selfGetManage = new SelfGetManage(_baseUrl);
		}
		return _selfGetManage;
	};

	/**
	 * get SignManage
	 */
	that.getSignManage = function(){
		if(!_signManage){
			if(!SignManage||typeof SignManage !== 'function'){
				alert('SignManage 加载失败，请重新刷新页面。');
				return;
			}
			_signManage = new SignManage(_baseUrl);
		}
		return _signManage;
	};


	/**
	 * get EmigratedManage 全民闯关
	 */
	that.getEmigratedManage = function(){
		if(!_emigratedManage){
			if(!EmigratedManage||typeof EmigratedManage !== 'function'){
				alert('EmigratedManage 加载失败，请重新刷新页面。');
				return;
			}
			_emigratedManage = new EmigratedManage(_baseUrl);
		}
		return _emigratedManage;
	};

	/**
	 * get FightTeamManage 全民团战
	 */
	that.getFightTeamManage = function(){
		if(!_fightTeamManage){
			if(!FightTeamManage||typeof FightTeamManage !== 'function'){
				alert('FightTeamManage 加载失败，请重新刷新页面。');
				return;
			}
			_fightTeamManage = new FightTeamManage(_baseUrl);
		}
		return _fightTeamManage;
	};

	/**
	 * get ExperienceManage 体验金
	 */
	that.getExperienceManage = function(){
		if(!_experienceManage){
			if(!ExperienceManage||typeof ExperienceManage !== 'function'){
				alert('ExperienceManage 加载失败，请重新刷新页面。');
				return;
			}
			_experienceManage = new ExperienceManage(_baseUrl);
		}
		return _experienceManage;
	};

	/**
	 * 点触
	 * @param {function} callback 回调函数
	 */
	/*that.openTouClick = function(callback){
		if(!TouClick){
			//透过jquery 动态加载 js 
			$.getScript(_touClickUrl).done(function( script, textStatus ) {
				if(TouClick){
					_startTouClick(callback);
				}else{
					callback({success:false,message:'点触验证加载失败，请刷新页面！'});
				}
			}).fail(function( jqxhr, settings, exception ) {
				callback({success:false,message:'点触验证加载失败，请刷新页面！'});
			});
		}else{
			_startTouClick(callback);
		}
	};*/

	/**
	 * 中止ajax
	 */
	that.abortAjax = _abortAjax;

	/**
	 * 是否为webview开启
	 */
	that.isWebapp = function(){
		return sessionStorage['webapp']?JSON.parse(sessionStorage['webapp']):false;
	};

	_init();
	/**
	 * 初始化
	 */
	function _init(){
		/**
		 * 离开网页时，检查是否有正在运行的ajax
		 */
		$(window).bind('beforeunload',function(){
			if(_hasRunAjax()){
				return '目前尚有正在执行的动作，可能会造成资料异常，确定要离开？';
			}
		});

		/**
		 * 离开网页时，退出运行的ajax
		 */
		$(window).bind('unload',_abortAjax);

		_initUrlParamValue();

		if(!that.isWebapp()&&_urlParamValue['webapp']){
			sessionStorage['webapp'] = _urlParamValue['webapp'];
		}
	}

	/**
	 * 如果有ajax在运行的话，就退出运行的ajax
	 */
	function _abortAjax(){
		for(var key in _ajaxObj){
			if(_ajaxObj[key]&&_ajaxObj[key].abort){
				_ajaxObj[key].abort();
				_ajaxObj[key] = false;
			}
		}
	}

	/**
	 * 检查是否有正在运行的ajax
	 */
	function _hasRunAjax(){
		for(var key in _ajaxObj){
			if(_ajaxObj[key]&&_ajaxObj[key].abort){
				return true;
			}
		}
		return false;
	}

	/**
	 * 统一使用 ajax
	 * @param {Object} config 资料
	 * {
	 *		url:来源网址,
	 *		param:请求参数,
	 *		timeout:timeout ms,
	 *		callback:回调方法
	 *	}
	 */
	var _dataType = ['json'];
	that.ajax = function(config){
		//预设参数
		var _config = {
			url:false,
			param:{},
			type:'post',
			dataType:'json',
			timeout:false,
			callback:false
		};

		$.extend(_config,config);

		//统一回传讯息
		var _result = {
			success:false,
			message:''
		};
		//检查网址是否存在
		if(!_config.url){
			_result.message='来源网址不存在！';
			_executeCallBack(_result);
			return;
		}

		//检查返回资料格式
		if(_dataType.indexOf(_config.dataType)==-1){
			_result.message='不支持'+_config.dataType+'资料格式！';
			_executeCallBack(_result);
			return;
		}

		//避免重複執行
		if(_ajaxObj[_config.url]){
			_result.message='目前正在执行，请稍候再尝试！';
			console.log(_result)
//			_executeCallBack(_result);
			return;
		}
		_ajaxObj[_config.url] = true;

		//回調
		function _executeCallBack(result){
			if(typeof _config.callback ==='function'){
				_config.callback(result);
			}
		}
		_ajaxObj[_config.url] = $.ajax({
			type:_config.type,
			url:_config.url,
			data:_config.param,
			dataType:_config.dataType,
			timeout:_config.timeout,
			success:function(result){
				_ajaxObj[_config.url] = false;
				$.extend(_result,result);
				_executeCallBack(_result);
				_result = null;
			}
		}).fail(function(result) {
			_ajaxObj[_config.url] = false;
			_result.message = _getStatusText(result.status,result.statusText);
			if(_result.message){
				_executeCallBack(_result);
			}
			_result = null;
		});

		return _ajaxObj[_config.url];
	};

	/**
	 * 取得请求失败信息
	 * @param {String} statusCode HttpStatusCode
	 * @param {String} statusText status = 0 有不同的状况
	 * @return {String} text 对应的信息
	 */
	function _getStatusText(statusCode,statusText){
		var text = '错误代码：'+statusCode+' '+statusText;
		if(statusCode!=0){
			switch (statusCode){
				case 400://reload
					text = '當前請求無法理解！';
					break;
				case 403:
					text = '拒絕執行當前請求！';
					break;
				case 404:
					text = '网址不存在！';
					break;
				case 408 :
					text = '请求超时，请稍候再试！';
					break;
				case 500 :
					text = '发生无法预料错误！';
					break;
				case 502 :
					text = '请求无回应，请稍候再试！';
					break;
				case 504 :
					text = '请求超时，请稍候再试！';
					break;
			}
		}else{
			switch (statusText){
				case 'error'://reload
					text = '网路异常，请稍候再试！';
					break;
				case 'timeout':
					text = '请求超时，请稍候再试！';
					break;
				case 'abort':
//					text = '请求已中断！';
					text = false;
					break;
			}
		}
		return text;
	}

	/**
	 * 点触
	 * @param {function} callback 回调函数
	 */
	function _startTouClick(callback){
		if(!window.touClickObj){
			window.touClickObj = new TouClick('touclick-container',{
	            onSuccess: _touClickSuccess,
	            onError:_touClickError
			});
		}
		window.touClickObj.callback = callback;
		window.touClickObj.start();
	}
	/**
	 * 点触 成功回调
	 * @param {Object} obj
	 */
	function _touClickSuccess(obj){
		window.touClickObj.close();
		if(!window.touClickObj.callback)return;
		window.touClickObj.callback({success:true,data:obj});
    	window.touClickObj.callback = false;
	}

	/**
	 * 点触 失败回调
	 * @param {Object} obj
	 */
	function _touClickError(obj){
		window.touClickObj.close();
		if(!window.touClickObj.callback)return;
    	window.touClickObj.callback({success:false,data:obj,message:'点触验证加载失败，请刷新页面！'});
    	window.touClickObj.callback = false;
	}

	//轉址
	function _redirect(key,param,target){
		var action = _actions[key];
		if(!action){
			alert(key+' 不存在');
			return;
		}
		var url = _urls[action];
		if(!url){
			alert(key+' 不存在');
			return;
		}
		setSessionStorage(key,param);
		if(!/^(http|https):\/\//.test(url)){
			url = _baseUrl+url;
		}
		if(!target){
			//that.getLoader().open('跳转中');
			window.location.href = url;
		}else if(target=='_blank '){
			window.open(url,target)
		}

		action = url = null;
	}

	/**
	 * get SessionStorage
	 */
	function getSessionStorage(key){
		if(!key)return undefined;

		var action = _actions[key];
		if(!action)
			alert(key+' 不存在');

		var name = _storages[action];
		var storage = sessionStorage[name];
		if(storage){
			return JSON.parse(storage);
		}else{
			return {};
		}
		action = name = storage = null;
	}

	/**
	 * set SessionStorage
	 */
	function setSessionStorage(key,param){
		if(!key)return;
		if(!param)return;

		var action = _actions[key];
		if(!action)
			alert(key+' 不存在');

		var name = _storages[action];
		var storage = sessionStorage[name];
		if(storage){
			var obj = JSON.parse(storage);
			$.extend(obj,param);
			sessionStorage[name] = JSON.stringify(obj);
		}else{
			sessionStorage[name] = JSON.stringify(param);
		}
		action = name = storage = null;
	}

	/**
	 * get LocalStorage
	 */
	function getLocalStorage(key){
		if(!key)return undefined;

		var action = _actions[key];
		if(!action)
			alert(key+' 不存在');

		var name = _storages[action];
		var storage = localStorage[name];
		if(storage){
			return JSON.parse(storage);
		}else{
			return {};
		}
		action = name = storage = null;
	}

	/**
	 * set LocalStorage
	 */
	function setLocalStorage(key,param){
		if(!key)return;
		if(!param)return;

		var action = _actions[key];
		if(!action)
			alert(key+' 不存在');

		var name = _storages[action];
		var storage = localStorage[name];
		if(storage){
			var obj = JSON.parse(storage);
			$.extend(obj,param);
			localStorage[name] = JSON.stringify(obj);
		}else{
			localStorage[name] = JSON.stringify(param);
		}
		action = name = storage = null;
	}

	/**
	 * 解析Url param内容
	 */
	function _initUrlParamValue() {
		_urlParamValue = {};
		var query = window.location.search.substring(1);
		if(query.length==0)return;
		var vars = query.split("&"),pair;
		for (var i=0;i<vars.length;i++) {
			pair = vars[i].split("=");
			_urlParamValue[pair[0]] = pair[1];
		}
		query = vars = pair = null;
	}

	/**
	 * 产生get参数值
	 * @returns {String}
	 */
	function _getLocationSearch(){
		var search = '?';
		var param = '{0}={1}&';
		for (var i in _urlParamValue) {
			search+=String.format(param,i,_urlParamValue[i]);
		}
		search = search.length==1?'':search.slice(0,search.length-1);
		return search;
	}
}
