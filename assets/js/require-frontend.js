require.config({
	urlArgs: "v=" + requirejs.s.contexts._.config.config.site.version,
	packages: [{
		name: "moment",
		location: "https://cdn.staticfile.org/moment.js/2.29.0/",
		main: "moment"
	}], 
	include: ["css", "layer", "toastr", "fast", "frontend", "frontend-init", "table", "form", "dragsort", "drag", "drop", "selectpage"],
	paths: {
		lang: "empty:",
		form: "require-form",
		table: "require-table",
		upload: "require-upload",
		drag: "jquery.drag.min",
		drop: "jquery.drop.min",
		dropzone: "dropzone.min",
		echarts: "echarts.min",
		"echarts-theme": "echarts-theme",
		adminlte: "adminlte",
		"bootstrap-table-commonsearch": "bootstrap-table-commonsearch",
		"bootstrap-table-template": "bootstrap-table-template",
		jquery: "https://cdn.staticfile.org/jquery/2.2.4/jquery.min",
		bootstrap: "https://cdn.staticfile.org/twitter-bootstrap/3.4.1/js/bootstrap.min",
		"bootstrap-datetimepicker": "../libs/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min",
		"bootstrap-daterangepicker": "../libs/bootstrap-daterangepicker/daterangepicker",
		"bootstrap-select": "../libs/bootstrap-select/dist/js/bootstrap-select.min",
		"bootstrap-select-lang": "../libs/bootstrap-select/dist/js/i18n/defaults-zh_CN",
		"bootstrap-table": "../libs/bootstrap-table/dist/bootstrap-table.min",
		"bootstrap-table-export": "../libs/bootstrap-table/dist/extensions/export/bootstrap-table-export.min",
		"bootstrap-table-fixed-columns": "../libs/bootstrap-table/dist/extensions/fixed-columns/bootstrap-table-fixed-columns",
		"bootstrap-table-mobile": "../libs/bootstrap-table/dist/extensions/mobile/bootstrap-table-mobile",
		"bootstrap-table-lang": "../libs/bootstrap-table/dist/locale/bootstrap-table-zh-CN",
		"bootstrap-table-jumpto": "../libs/bootstrap-table/dist/extensions/page-jumpto/bootstrap-table-jumpto",
		tableexport: "../libs/tableExport.jquery.plugin/tableExport.min",
		dragsort: "../libs/fastadmin-dragsort/jquery.dragsort",
		sortable: "../libs/Sortable/Sortable.min",
		addtabs: "../libs/fastadmin-addtabs/jquery.addtabs",
		slimscroll: "../libs/jquery-slimscroll/jquery.slimscroll",
		validator: "https://cdn.staticfile.org/nice-validator/1.1.5/jquery.validator",
		"validator-lang": "https://cdn.staticfile.org/nice-validator/1.1.5/local/zh-CN",
		toastr: "../libs/toastr/toastr",
		jstree: "../libs/jstree/dist/jstree.min",
		layer: "../libs/fastadmin-layer/dist/layer",
		cookie: "../libs/jquery.cookie/jquery.cookie",
		cxselect: "../libs/fastadmin-cxselect/js/jquery.cxselect",
		template: "../libs/art-template/dist/template-native",
		selectpage: "../libs/fastadmin-selectpage/selectpage",
		citypicker: "../libs/fastadmin-citypicker/dist/js/city-picker.min",
		"citypicker-data": "../libs/fastadmin-citypicker/dist/js/city-picker.data"
	},
	shim: {
		addons: ["frontend"],
		bootstrap: ["jquery"],
		"bootstrap-table": {
			deps: ["bootstrap"],
			exports: "$.fn.bootstrapTable"
		},
		"bootstrap-table-lang": {
			deps: ["bootstrap-table"],
			exports: "$.fn.bootstrapTable.defaults"
		},
		"bootstrap-table-export": {
			deps: ["bootstrap-table", "tableexport"],
			exports: "$.fn.bootstrapTable.defaults"
		},
		"bootstrap-table-fixed-columns": {
			deps: ["bootstrap-table"],
			exports: "$.fn.bootstrapTable.defaults"
		},
		"bootstrap-table-mobile": {
			deps: ["bootstrap-table"],
			exports: "$.fn.bootstrapTable.defaults"
		},
		"bootstrap-table-advancedsearch": {
			deps: ["bootstrap-table"],
			exports: "$.fn.bootstrapTable.defaults"
		},
		"bootstrap-table-commonsearch": {
			deps: ["bootstrap-table"],
			exports: "$.fn.bootstrapTable.defaults"
		},
		"bootstrap-table-template": {
			deps: ["bootstrap-table", "template"],
			exports: "$.fn.bootstrapTable.defaults"
		},
		"bootstrap-table-jumpto": {
			deps: ["bootstrap-table"],
			exports: "$.fn.bootstrapTable.defaults"
		},
		tableexport: {
			deps: ["jquery"],
			exports: "$.fn.extend"
		},
		slimscroll: {
			deps: ["jquery"],
			exports: "$.fn.extend"
		},
		adminlte: {
			deps: ["bootstrap", "slimscroll"],
			exports: "$.AdminLTE"
		},
		"bootstrap-daterangepicker": ["moment/locale/zh-cn"],
		"bootstrap-datetimepicker": ["moment/locale/zh-cn"],
		"bootstrap-select-lang": ["bootstrap-select"],
		jstree: ["css!../libs/jstree/dist/themes/default/style.css"],
		"validator-lang": ["validator"],
		citypicker: ["citypicker-data", "css!../libs/fastadmin-citypicker/dist/css/city-picker.css"]
	},
	//baseUrl: requirejs.s.contexts._.config.config.site.cdnurl + "/assets/js/",
	baseUrl: "https://cdn.jsdelivr.net/gh/ziy66/wy/assets/js/",
	
	map: {
		"*": {
			css: "../libs/require-css/css.min"
		}
	},
	waitSeconds: 30,
	charset: "utf-8"
}),
require(["jquery", "bootstrap"],
function(t, e) {
	var a = requirejs.s.contexts._.config.config;
	window.Config = a;
	var s = {};
	//s.lang = a.moduleurl + "/ajax/lang?callback=define&controllername=" + a.controllername + "&lang=" + a.language + "&v=" + a.site.version,
	s.lang = "https://cdn.jsdelivr.net/gh/ziy66/wy/assets/lang.json",
	s["frontend/"] = "frontend/",
	require.config({
		paths: s
	}),
	t(function() {
		require(["fast"],
		function(t) {
			require(["frontend", "frontend-init", "addons"],
			function(t, s) {
				a.jsname && require([a.jsname],
				function(t) {
					t[a.actionname] != e && t[a.actionname]()
				},
				function(t) {
					console.error(t)
				})
			})
		})
	})
});