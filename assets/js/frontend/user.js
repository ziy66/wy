define(['jquery', 'bootstrap', 'frontend', 'form', 'template'], function ($, undefined, Frontend, Form, Template) {
    var validatoroptions = {
        invalid: function (form, errors) {
            $.each(errors, function (i, j) {
                Layer.msg(j);
                $(form).find('button[type="submit"]').html('登录').removeAttr('readonly');
            });
        }
    };
    var kjlogspage = 0;
    var kjlogsloading = false;
    var indexloading = false;
    var planlistloading = false;
    var balanceloading = false;
    var winloseloading = false;
    var Controller = {
        login: function () {
            //for keep login
            if (localStorage.getItem('username') !== null) {
                $('#account').val(localStorage.getItem('username'));
                $('#password').val(localStorage.getItem('password'));
                $('#keeplogin').prop('checked', true);
            }
            //本地验证未通过时提示
            $("#login-form").data("validator-options", validatoroptions);

            $(document).on("change", "input[name=type]", function () {
                var type = $(this).val();
                $("div.form-group[data-type]").addClass("hide");
                $("div.form-group[data-type='" + type + "']").removeClass("hide");
                $('#resetpwd-form').validator("setField", {
                    captcha: "required;length(4);integer[+];remote(" + $(this).data("check-url") + ", event=resetpwd, " + type + ":#" + type + ")",
                });
                $(".btn-captcha").data("url", $(this).data("send-url")).data("type", type);
            });

            $(document).on("click", '#login-form button[type="submit"]', function (e) {
                if (typeof $(this).attr('readonly') !== 'undefined') {
                    return e.preventDefault();
                }
                $(this).html('登录中<i class="fa fa-spinner fa-pulse"></i>').attr('readonly', 'readonly');
            });

            //为表单绑定事件
            Form.api.bindevent($("#login-form"), function (data, ret) {
                if (typeof(Storage) !== "undefined") {
                    if ($('#keeplogin').prop('checked') === true) {
                        localStorage.setItem('username', $('#account').val());
                        localStorage.setItem('password', $('#password').val());
                    } else {
                        localStorage.removeItem('username');
                        localStorage.removeItem('password');
                    }
                }
                setTimeout(function () {
                    location.href = ret.url ? ret.url : "/";
                }, 1000);
            }, function (data) {
                $('#login-form').find('button[type="submit"]').html('登录').removeAttr('readonly');
            });

            Form.api.bindevent($("#resetpwd-form"), function (data) {
                Layer.closeAll();
            });

            $(document).on("click", ".btn-forgot", function () {
                var id = "resetpwdtpl";
                var content = Template(id, {});
                Layer.open({
                    type: 1,
                    title: __('Reset password'),
                    area: ["450px", "355px"],
                    content: content,
                    success: function (layero) {
                        Form.api.bindevent($("#resetpwd-form", layero), function (data) {
                            Layer.closeAll();
                        });
                    }
                });
            });
        },
        register: function () {
            //本地验证未通过时提示
            $("#register-form").data("validator-options", validatoroptions);

            //为表单绑定事件
            Form.api.bindevent($("#register-form"), function (data, ret) {
                setTimeout(function () {
                    location.href = ret.url ? ret.url : "/";
                }, 1000);
            }, function (data) {
                $("input[name=captcha]").next(".input-group-addon").find("img").trigger("click");
            });
        },
        changepwd: function () {
            //本地验证未通过时提示
            $("#changepwd-form").data("validator-options", validatoroptions);

            //为表单绑定事件
            Form.api.bindevent($("#changepwd-form"), function (data, ret) {
                setTimeout(function () {
                    location.href = ret.url ? ret.url : "/";
                }, 1000);
            });
        },
        profile: function () {
            // 给上传按钮添加上传成功事件
            $("#faupload-avatar").data("upload-success", function (data) {
                var url = Fast.api.cdnurl(data.url);
                $(".profile-user-img").prop("src", url);
                Toastr.success(__('Uploaded successful'));
            });
            Form.api.bindevent($("#profile-form"));
            $(document).on("click", ".btn-change", function () {
                var that = this;
                var id = $(this).data("type") + "tpl";
                var content = Template(id, {});
                Layer.open({
                    type: 1,
                    title: "修改",
                    area: ["400px", "250px"],
                    content: content,
                    success: function (layero) {
                        var form = $("form", layero);
                        Form.api.bindevent(form, function (data) {
                            location.reload();
                            Layer.closeAll();
                        });
                    }
                });
            });
        },
        attachment: function () {
            require(['table'], function (Table) {

                // 初始化表格参数配置
                Table.api.init({
                    extend: {
                        index_url: 'user/attachment',
                    }
                });
                var urlArr = [];
                var multiple = Fast.api.query('multiple');
                multiple = multiple == 'true' ? true : false;

                var table = $("#table");

                table.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function (e, row) {
                    if (e.type == 'check' || e.type == 'uncheck') {
                        row = [row];
                    } else {
                        urlArr = [];
                    }
                    $.each(row, function (i, j) {
                        if (e.type.indexOf("uncheck") > -1) {
                            var index = urlArr.indexOf(j.url);
                            if (index > -1) {
                                urlArr.splice(index, 1);
                            }
                        } else {
                            urlArr.indexOf(j.url) == -1 && urlArr.push(j.url);
                        }
                    });
                });

                // 初始化表格
                table.bootstrapTable({
                    url: $.fn.bootstrapTable.defaults.extend.index_url,
                    sortName: 'id',
                    showToggle: false,
                    showExport: false,
                    columns: [
                        [
                            {field: 'state', checkbox: multiple, visible: multiple, operate:false},
                            {field: 'id', title: __('Id')},
                            {field: 'url', title: __('Preview'), formatter: function (value, row, index) {
                                    if (row.mimetype.indexOf("image") > -1) {
                                        var style = row.storage === 'upyun' ? '!/fwfh/120x90' : '';
                                        return '<a href="' + row.fullurl + '" target="_blank"><img src="' + row.fullurl + style + '" alt="" style="max-height:90px;max-width:120px"></a>';
                                    } else {
                                        return '<a href="' + row.fullurl + '" target="_blank"><img src="' + Fast.api.fixurl("ajax/icon") + "?suffix=" + row.imagetype + '" alt="" style="max-height:90px;max-width:120px"></a>';
                                    }
                                }, operate: false},
                            {field: 'filename', title: __('Filename'), formatter: Table.api.formatter.search, operate: 'like'},
                            {field: 'imagewidth', title: __('Imagewidth'), operate: false},
                            {field: 'imageheight', title: __('Imageheight'), operate: false},
                            {
                                field: 'mimetype', title: __('Mimetype'), operate: 'LIKE %...%',
                                process: function (value, arg) {
                                    return value.replace(/\*/g, '%');
                                }
                            },
                            {field: 'createtime', title: __('Createtime'), formatter: Table.api.formatter.datetime, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                            {
                                field: 'operate', title: __('Operate'), events: {
                                    'click .btn-chooseone': function (e, value, row, index) {
                                        Fast.api.close({url: row.url, multiple: multiple});
                                    },
                                }, formatter: function () {
                                    return '<a href="javascript:;" class="btn btn-danger btn-chooseone btn-xs"><i class="fa fa-check"></i> ' + __('Choose') + '</a>';
                                }
                            }
                        ]
                    ]
                });

                // 选中多个
                $(document).on("click", ".btn-choose-multi", function () {
                    Fast.api.close({url: urlArr.join(","), multiple: multiple});
                });

                // 为表格绑定事件
                Table.api.bindevent(table);
                require(['upload'], function (Upload) {
                    Upload.api.upload($("#toolbar .faupload"), function () {
                        $(".btn-refresh").trigger("click");
                    });
                });

            });
        },
        index: function () {
            initData();
            initKjLogs();
            initPlanList();
            var interval = setInterval(function () {
                initData();
                initPlanList();
            }, 20000);
            $(document).on("click", "a.refresh", function () {
                if (typeof $(this).attr('disabled') !== 'undefined') {
                    return;
                }
                $(this).find('img').hide();
                $(this).find('.fa-spinner').css('display', 'block');
                $(this).addClass('p-2');
                $(this).attr('disabled', 'disabled');
                initData(true);
                initKjLogs(1);
                initPlanList();
            });

            $(document).on("change", "#lotterys", function () {
                initData();
                initPlanList();
            });

            $(document).on("click", "#open-button", function () {
                var action = $(this).parent('.action-button').hasClass('on-box') ? '开启' : '关闭';
                Fast.api.ajax({
                    url: 'robot/opens',
                    data: { lottery: document.querySelector('#lotterys').value, lottery_name: document.querySelector('#lotterys').selectedOptions[0].innerText, action: action }
                }, function (ret) {
                    initData();
                });
            });

            $(document).on("click", "#stopopen", function (e) {
                Fast.api.ajax({
                    url: 'user/stopopen',
                    data: {}
                }, function (ret) {});
            });

            $(document).on("click", "#editplantype", function () {
                var sta_amounts = [];
                document.querySelectorAll('.sta_amount').forEach(function (data, index) {
                    sta_amounts.push(data.value);
                });
                
                Fast.api.ajax({
                    url: 'robot/editplantype',
                    data: { lottery: document.querySelector('#lotterys').value, sta_amount: sta_amounts.join('|'), lottery_name: document.querySelector('#lotterys').selectedOptions[0].innerText }
                }, function (ret) {
                    initData();
                });
            });
            
            $(document).on("click", "a.refresh-balance", function () {
                if (typeof $(this).attr('disabled') !== 'undefined') {
                    return;
                }
                $(this).find('img').hide();
                $(this).find('.fa-spinner').css('display', 'block');
                $(this).addClass('p-2');
                $(this).attr('disabled', 'disabled');
                if (balanceloading === true) {
                    return
                }
                balanceloading = true;
                Fast.api.ajax({
                    url: 'user/updateBalance',
                    data: {}
                }, function (ret) {
                    if (ret) {
                        $('#user-money').html(ret);
                    }
                    $('a.refresh-balance').find('img').show();
                    $('a.refresh-balance').find('.fa-spinner').hide();
                    $('a.refresh-balance').removeAttr('disabled');
                    $('a.refresh-balance').removeClass('p-2');
                    balanceloading = false;
                });
				
				Fast.api.ajax({
                    url: 'user/updateWinlose',
                    data: {},
                    alert: false
                }, function (ret) {
                    if (ret) {
                        $('#user-win_lose').html(ret);
                    }
                });

            });

			/*
            $(document).on("click", "a.refresh-winlose", function () {
                if (typeof $(this).attr('disabled') !== 'undefined') {
                    return;
                }
                $(this).find('img').hide();
                $(this).find('.fa-spinner').css('display', 'block');
                $(this).addClass('p-2');
                $(this).attr('disabled', 'disabled');
                if (winloseloading === true) {
                    return
                }
                winloseloading = true;
                Fast.api.ajax({
                    url: 'user/updateWinlose',
                    data: {}
                }, function (ret) {
                    if (ret) {
                        $('#user-win_lose').html(ret);
                    }
                    $('a.refresh-winlose').find('img').show();
                    $('a.refresh-winlose').find('.fa-spinner').hide();
                    $('a.refresh-winlose').removeAttr('disabled');
                    $('a.refresh-winlose').removeClass('p-2');
                    winloseloading = false;
                });

            });
			*/

            $(document).ready(function () {
                $('.main-inner').on('scroll', chk_scroll);
                $('[data-toggle="tooltip"]').tooltip();
            });

            function chk_scroll(e) {
                var elem = $(e.currentTarget);                
                if ($('#planTab.active').length > 0) {
                    if(elem.scrollTop() >= (document.querySelector('#planTab').clientHeight - 300)) {
                        // elem.css('overflow-y', 'hidden');
                        if ($('#plantab-backtotop').length == 0)
                            $('#planTab').after('<div class="text-center backtotop"><a href="javascript:;"id="plantab-backtotop" class="text-success backtotop">已到最低了，按此返回上面</a></div>');
                    }
                } else if ($('#editPlanTab.active').length > 0) {
                    if(elem.scrollTop() >= (document.querySelector('#editPlanTab').clientHeight - 300)) {
                        // elem.css('overflow-y', 'hidden');
                        if ($('#editplantab-backtotop').length == 0)
                            $('#editPlanTab').after('<div class="text-center backtotop"><a href="javascript:;" id="editplantab-backtotop" class="text-success backtotop">已到最低了，按此返回上面</a></div>');
                    }
                } else if ($('#recordTab.active').length > 0) {
                    if (Math.round(elem[0].scrollHeight - elem.scrollTop()) == Math.round(elem.outerHeight())) {
                        initKjLogs();
                    }
                }

                $('.backtotop').on('click', function () {
                    document.querySelector('.main-inner').scrollTop = 0;
                    document.querySelector('.main-inner').style.overflowY = 'scroll';
                    $('.backtotop').remove();
                });
            }

            function initData(alert = false) {
                if (indexloading === true) {
                    return;
                } else {
                    indexloading = true;
                }
                var lottery_id = document.querySelector('#lotterys').value;
                Fast.api.ajax({
                    url: 'user/index',
                    data: { lottery: lottery_id },
                    alert: alert
                }, function (ret) {
                    var plantype = ret['plantype'];
                    // var plan = ret['plan'];
                    var lotterys = ret['lotterys'];
                    var opens = ret['opens'];
                    var user = ret['user'];
                    var winlose = ret['winlose'];
                    var kjlogs = ret['kjlogs'];

                    $('#user-money').html(user.amount ? user.amount : '0.00');
                    $('#user-win_lose').html(winlose);

                    if (opens != null && typeof opens.status !== 'undefined' && (opens.status === 1 || opens.status === 3)) {
                        $('#user-status').html('循环开启');
                        $('#open-button').html('停止循环');
                        $('#open-button').parent('.action-button').removeClass('on-box').addClass('off-box');                        
                    } else {
                        $('#user-status').html('循环关闭');
                        if (opens != null && typeof opens.status !== 'undefined' && opens.status === 2) {
                            $('#open-button').html('锁定中, 请联系工作室');
                        } else {
                            $('#open-button').html('开始循环');
                        }
                        $('#open-button').parent('.action-button').removeClass('off-box').addClass('on-box');
                    }

                    if (opens != null && typeof opens.start_amt_customize !== 'undefined' && opens.start_amt_customize === 1) {
                        $('#editplantype').removeAttr('disabled');
                    } else {
                        $('#editplantype').attr('disabled', 'disabled');
                    }

                    //if (user.status === 1 && (opens.status === 1 || opens.status === 3)) {
                    if (user.status === 1) {
                        $('#current-status').html('允许使用');
                        $('#open-button').removeAttr('disabled');
                    } else {
                        $('#current-status').html('今日缺期则禁止');
                        $('#open-button').attr('disabled', 'disabled');
                    }
                    //$('#open-button').attr('disabled', 'disabled');

                    // var table = $('#table-plantype');
                    // var html = "";
                    // if (typeof plan[3] !== 'undefined') {
                    //     var i;
                    //     for (i = 3; i < 20; i ++) {
                    //         var data = plan[i];
                    //         var yl = data['yl'] === null ? 0 : data['yl'];
                    //         html += '<tr>' +
                    //         '<td>' + i + '</td>' +
                    //         '<td>' + data['plan'].plan_name + '</td>' +
                    //         '<td>' + yl + '</td>' +
                    //         '<td>' + data.bet_amount + '</td>' +
                    //         '<td>' + data.total_bet_amount + '</td>' +
                    //         '<td class="text-danger">' + data.bet_status + '</td>' +
                    //         '</tr>';
                    //     }

                    //     table.find('tbody').html(html);
                    // } else {
                    //      table.find('tbody').html('');
                    // }

                    var lotterysHtml = "";
                    if (typeof lotterys[0] !== 'undefined') {
                        lotterys.forEach(function (lottery) {
                            lotterysHtml += '<option value="' + lottery.id + '">' + lottery.name + '</option>';
                        });
                        $('#lotterys').html(lotterysHtml);
                        $('#lotterys').val(lottery_id);
                    }

                    var table = $('#table-editplan');
                    var html = "";                    
                    if (typeof plantype[0] !== 'undefined') {
                        var sta_amount = opens.sta_amount.split('|');
                        plantype.forEach(function (data, index) {
                            customize = opens.start_amt_customize;
                            html += '<tr>' +
                            '<td>' + data.plan_name + '</td>' +
                            '<td><input type="number" step="0.01" class="form-control text-center sta_amount" ' + (customize === 0 ? 'disabled="disabled"' : '') + ' style="color: inherit !important;" id="start_amt_default-' + data.id + '" name="start_amt_default-' + data.id + '" value="' + sta_amount[index] + '"/></td>' +
                            '<td>' + data.empty_period + '</td>' +
                            '<td>' + data.trigger_ratio0 + '</td>' +
                            '<td>' + data.trigger_amt1 + '</td>' +
                            '<td>' + data.trigger_ratio1 + '</td>' +
                            '<td>' + data.trigger_amt2 + '</td>' +
                            '<td>' + data.trigger_ratio2 + '</td>' +
                            '</tr>';
                        });

                        table.find('tbody').html(html);
                    } else {
                         table.find('tbody').html('');
                    }

                    if (typeof kjlogs[0] !== 'undefined') {
                        var latestDate = kjlogs[0].issue;
                        var latestCodes = kjlogs[0].code.split(",");
                        var latestCodeHtml = '';
                        latestCodes.forEach(function (code, index) {
                            latestCodeHtml += '<span class="num num' + code + '"></span>&nbsp;';
                        });
                        $('#latest-date').html(latestDate);
                        $('#latest-num').html(latestCodeHtml);
                    }
                    indexloading = false;
                }, function (data, ret) {
                    indexloading = false;
                    var url = ret.url ? ret.url : "";
                    if (url != '') {
                        setTimeout(function () {
                            location.href = url;
                        }, 1000);
                    }
                });
            }

            function initKjLogs(page = null, alert = false) {                
                if (kjlogsloading === true) {
                    return;
                } else {
                    kjlogsloading = true;
                }
                if (page === null) {
                    kjlogspage += 1;
                } else {
                    kjlogspage = page;
                }
                var lottery_id = document.querySelector('#lotterys').value;
                var issue = $('#recordTab tr').last().attr('data-issue');
                issue = typeof issue === 'undefined' ? '' : issue;
                $('#table-numberbox').append('<tr class="spinner text-center"><td><i class="fa fa-spinner fa-spin"></i></td></tr>');
                Fast.api.ajax({
                    url: 'user/RobotKjlogs',
                    data: { lottery: lottery_id, page: kjlogspage, issue: issue},
                    alert: alert
                }, function (ret) {
                    var kjlogs = ret;
                    var table = $('#table-numberbox');
                    var html = "";
                    if (typeof kjlogs[0] !== 'undefined') {
                        if (kjlogspage === 1) {
                            var latestDate = kjlogs[0].issue;
                            var latestCodes = kjlogs[0].code.split(",");
                            var latestCodeHtml = '';
                            latestCodes.forEach(function (code, index) {
                                latestCodeHtml += '<span class="num num' + code + '"></span>&nbsp;';
                            });
                            $('#latest-date').html(latestDate);
                            $('#latest-num').html(latestCodeHtml);
                        }
                        kjlogs.forEach(function (data, index) {
                            var codes = data.code.split(",");
                            var numHtml = "";
                            codes.forEach(function (code, index) {
                                numHtml += '<span class="num num' + code + '"></span>&nbsp;';
                            });
                            html += '<tr data-issue="' + data.issue + '"><td class="text-center">' + data.issue + '期<div class="numberbox" style="margin-top: 15px;">' + numHtml + '</div></td></tr>';
                        });
                        $('#table-numberbox').find('tr.spinner').remove();
                        if (kjlogspage == 1) {
                            table.find('tbody').html(html);
                        } else {
                            table.find('tbody').append(html);
                        }
                    } else {
                         // table.find('tbody').html('');
                    }
                    kjlogsloading = false;
                }, function (data, ret) {
                    var url = ret.url ? ret.url : "";
                    if (url != '') {
                        setTimeout(function () {
                            location.href = url;
                        }, 1000);
                    }
                });
            }

            function initPlanList(page = null, alert = false) {
                if (planlistloading === true) {
                    return;
                } else {
                    planlistloading = true;
                }
                var lottery_id = document.querySelector('#lotterys').value;
                Fast.api.ajax({
                    url: 'user/getPlanList',
                    data: { lottery: lottery_id },
                    alert: alert
                }, function (ret) {
                    var plan = ret['plan'];
                    var table = $('#table-plantype');
                    var html = "";
                    if (typeof plan[3] !== 'undefined') {
                        var i;
                        for (i = 3; i < 20; i ++) {
                            var data = plan[i];
                            var yl = data['yl'] === null ? 0 : data['yl'];
                            html += '<tr>' +
                            '<td>' + i + '</td>' +
                            '<td>' + data['plan'].plan_name + '</td>' +
                            '<td>' + yl + '</td>' +
                            '<td>' + data.bet_amount + '</td>' +
                            '<td>' + data.total_bet_amount + '</td>' +
                            '<td class="text-danger">' + data.bet_status + '</td>' +
                            '</tr>';
                        }

                        table.find('tbody').html(html);
                    } else {
                         table.find('tbody').html('');
                    }
                    $('a.refresh').find('img').show();
                    $('a.refresh').find('.fa-spinner').hide();
                    $('a.refresh').removeAttr('disabled');
                    $('a.refresh').removeClass('p-2');
                    planlistloading = false;
                }, function (data, ret) {
                    var url = ret.url ? ret.url : "";
                    if (url != '') {
                        setTimeout(function () {
                            location.href = url;
                        }, 1000);
                    }
                });
            }

        },
    };
    return Controller;
});
