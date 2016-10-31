﻿scotchApp.component('myFooter', {
    bindings: {},
    templateUrl: '../www/App/Views/footer.html',
    controller: function (mainService) {
        this.assignments = [];
        this.isManualCall = false;
        this.popupIsOpened = false;

        var self = this;

        var timer = (+localStorage.getItem("TASK_POLL_INT")) * 60000 || 5 * 60000;
        setTimeout(function () {
            if (localStorage.getItem("TASK_POLL_INT") !== null) {
                timer = (+localStorage.getItem("TASK_POLL_INT")) * 60000;
            }
            setInterval(function () {
                if (!self.popupIsOpened && mainService.appIsReady) {
                    self.getAssigments(false);
                }
            }, timer);
        }, timer)

        this.getReport = function () {
            location.href = "#/report";
            //createMSG30();
        }

        this.getAssigments = function (isManual) {
            mainService.getOfflineArray(); // check the offline memory if have data
            self.isManualCall = isManual;
            if (isManual) {
                $(".circle-wrapper").show();
            }
            mainService.getAssigments().then(function (result) {
                $(".circle-wrapper").hide();
                self.assignments = result.popupAssignments;
                console.log('%s %o', 'assignments popup : ', self.assignments);

                if (self.assignments.length == 0 && isManual) {
                    location.href = "#/assignments_all";
                } else if (self.assignments.length != 0) {
                    self.popupIsOpened = true;
                    $.magnificPopup.open({
                        items: {
                            src: $('#popupMsg'),
                            type: 'inline',
                            showCloseBtn: false
                        },
                        callbacks: {
                            close: function () {
                                self.popupIsOpened = false;
                            }
                        }
                    });
                }
            }, function (err) {
                console.log(err);
                if (isManual) {
                    navigator.notification.alert('אין תקשורת, נסה שנית');
                }               
                $(".circle-wrapper").hide();
            })
        }


        //this.getAssigments = function(flag){
        //    alert("footer");
        //}

        //this.getReport = function () {
        //    location.href = "#/reportOk/JSONreport/";
        //}



        //function createMSG30() {
        //    var USR = localStorage.getItem("USR");
        //    var USRKEY = localStorage.getItem("USRKEY");
        //    var MOKED = localStorage.getItem("MOKED");
        //    var date = getCurrentDate();

        //    var xml =
        //   '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
        //        <soapenv:Header/>\
        //            <soapenv:Body>\
        //                <tem:' + XMLMETHOD + '>\
        //                <!--Optional:-->\
        //                    <tem:xml>\
        //                        <![CDATA[\
        //                        <DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>30</CODE>\
        //                        <SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>4</VER></HEADER>\
        //					    <DATA>\
        //                            <USR>'+ USR + '</USR>\
        //                            <LOCK>0</LOCK>\
        //                            <MOKED>' + MOKED + '</MOKED>\
        //						</DATA></MSG></DATA>]]>\
        //                 </tem:xml>\
        //               </tem:' + XMLMETHOD + '>\
        //        </soapenv:Body>\
        //    </soapenv:Envelope>';
        //    //console.log('xml sending to report ' + xml);
        //    $
        //      .ajax(
        //                    {
        //                        url: serverUrl,
        //                        dataType: "xml",
        //                        //dataType: 'json',
        //                        type: "POST",
        //                        async: false,
        //                        contentType: "text/xml;charset=utf-8",
        //                        headers: {
        //                            "SOAPAction": SoapActionQA
        //                        },
        //                        crossDomain: true,
        //                        data: xml,
        //                        timeout: 30000 //30 seconds timeout
        //                    }).done(function (data) {
        //                        //console.log(data);
        //                        if (data != null) {
        //                            var dataXML = new XMLSerializer().serializeToString(data);
        //                            //console.log(dataXML);
        //                            var responseXML = $(dataXML).find("DataObject Data").text();
        //                            var json = $.xml2json(responseXML);
        //                            if (json.DATA.MSG.HEADER.CODE == 31) {
        //                                showReport(json.DATA.MSG.DATA);
        //                            } else {
        //                                var errorMessage = json.MSG.DATA.MSG.MSGTXT;
        //                                navigator.notification.alert(errorMessage);
        //                            }
        //                        }   //end if (data != null)                   
        //                    }).fail(function (jqXHR, textStatus, thrownError) {
        //                        navigator.notification.alert('אין תקשורת, נסה שנית');
        //                    });
        //}

        //function showReport(JSONreport) {
        //    //JSONreport must be converted to string in order to change view and pass it as a parameter (objects cannot be passed)
        //    var str = $.param(JSONreport);
        //    if (JSONreport.UNBALANCED == '') {
        //        console.log("to report OK");
        //        location.href = "#/reportOk/JSONreport/" + str;
        //    } else {
        //        console.log("to report not OK");
        //        location.href = "#/reportNOTOk/JSONreport/" + str;
        //    }
        //}



        //---------------------------------------------------------------------------------------///


        //var hasStat4Tasks = false;
        //var stat4TasksArray = [];
        //var stat4TasksArrayIndex = 0;
        //var isManualCall;


        //function CreateXml() {
        //    var date = getCurrentDate();
        //    var USR = localStorage.getItem("USR");
        //    var MOKED = localStorage.getItem("MOKED");
        //    var USRKEY = localStorage.getItem("USRKEY");

        //    var xml =
        //        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
        //        <soapenv:Header/>\
        //            <soapenv:Body>\
        //                <tem:'+ XMLMETHOD + '>\
        //                <!--Optional:-->\
        //                    <tem:xml>\
        //                        <![CDATA[\
        //                        <DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>34</CODE>\
        //                        <SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY> <DEVKEY>9999</DEVKEY><VER>4</VER></HEADER>\
        //                                            <DATA><USR>' + USR + '</USR>\
        //                        <MOKED>' + MOKED + '</MOKED>\
        //                                               </DATA></MSG></DATA>]]>\
        //                 </tem:xml>\
        //               </tem:'+ XMLMETHOD + '>\
        //        </soapenv:Body>\
        //    </soapenv:Envelope>';
        //    return xml;
        //}
        /*
        */


        //isManualCall = isManual;

        //if (isManualCall == "") { isManualCall == false; }
        //var xml = CreateXml();
        //$.ajax({
        //    url: serverUrl,
        //    dataType: "xml",
        //    //dataType: 'json',
        //    type: "POST",
        //    async: false,
        //    contentType: "text/xml;charset=utf-8",
        //    headers: {
        //        "SOAPAction": SoapActionQA
        //    },
        //    crossDomain: true,
        //    data: xml,
        //    timeout: 30000 //30 seconds timeout
        //}).done(function (data) {
        //    if (data != null) {
        //        var dataXML = new XMLSerializer().serializeToString(data);
        //        var responseXML = $(dataXML).find("DataObject Data").text();
        //        if (($(responseXML).find('TASK').length == 0 || responseXML == null || responseXML == '') && !isManualCall) { }
        //        else if ((responseXML == null || responseXML == '') && isManualCall) {
        //            location.href = "#/assignments_empty";
        //        } else {
        //            var json = $.xml2json(responseXML);
        //            if (json.DATA.MSG.HEADER.CODE == 20) {
        //                createTasks(json, isManualCall);
        //            } else {
        //                var errorMessage = json.MSG.DATA.MSG.MSGTXT;
        //                navigator.notification.alert(errorMessage);
        //            }
        //        }
        //    }
        //}).fail(function (jqXHR, textStatus, thrownError) {
        //    //navigator.notification.alert('אין תקשורת, נסה שנית');
        //});

        //function createTasks(JSONData, isManualCall) {
        //    var tasksCounter = 0;
        //    //var tasks = $.makeArray(JSONData.DATA.MSG.DATA.TASKS);
        //    var tasks = JSONData.DATA.MSG.DATA.TASKS;
        //    var tasksArray = $.makeArray(tasks.TASK);

        //    if (tasks == "" && isManualCall) {
        //        location.href = "#/assignments_empty";
        //    }
        //    else {
        //        //for (var TASK in tasks) {
        //        //    if (tasks.hasOwnProperty(TASK)) {
        //        //        var tasksArray = $.makeArray(tasks.TASK);
        //        //    }
        //        //}

        //        if (tasksArray.length == 0 && isManualCall) {
        //            //navigator.notification.alert('אין משימות פתוחות כרגע');
        //            location.href = "#/assignments_empty";
        //        } else {
        //            for (var i = 0; i < tasksArray.length; i++) {
        //                if (tasksArray[i].STAT == 1 || tasksArray[i].STAT == 2 || tasksArray[i].STAT == 3) {
        //                    if (tasksArray[i].Type == 1 || tasksArray[i].Type == 3) { //isuf
        //                        createTaskDiv(i, tasksArray[i].Type, tasksArray[i].STAT, tasksArray[i].new_contractid, tasksArray[i].new_contact_in_address, tasksArray[i].new_contact_main_phone, tasksArray[i].new_collection_from_hour, tasksArray[i].new_collection_to_hour, tasksArray[i].new_cityid, tasksArray[i].new_street, tasksArray[i].new_house_number, tasksArray[i].taskID.toString(), tasksArray[i].new_case_number, "");
        //                        tasksCounter++;
        //                    } else if (tasksArray[i].Type == 2) { //mesira                        
        //                        createTaskDiv(i, tasksArray[i].Type, tasksArray[i].STAT, tasksArray[i].new_account_number, tasksArray[i].new_contact_in_address, tasksArray[i].new_primary_telephone2, tasksArray[i].new_delivery_from_hour, tasksArray[i].new_delivery_until_hour, tasksArray[i].new_cityid, tasksArray[i].new_street, tasksArray[i].new_house_number, tasksArray[i].taskID.toString(), "", tasksArray[i].new_barkod);
        //                        tasksCounter++;
        //                    }
        //                } else {
        //                    if (tasksArray[i].STAT == 4 && isManualCall == true) {
        //                        hasStat4Tasks = true;
        //                        stat4TasksArray[stat4TasksArrayIndex] = [];
        //                        stat4TasksArray[stat4TasksArrayIndex]["taskType"] = tasksArray[i].Type;
        //                        stat4TasksArray[stat4TasksArrayIndex]["taskId"] = tasksArray[i].taskID.toString();
        //                        stat4TasksArray[stat4TasksArrayIndex]["contactName"] = tasksArray[i].new_contact_in_address;
        //                        stat4TasksArray[stat4TasksArrayIndex]["city"] = tasksArray[i].new_cityid;
        //                        stat4TasksArray[stat4TasksArrayIndex]["street"] = tasksArray[i].new_street;
        //                        stat4TasksArray[stat4TasksArrayIndex]["houseNumber"] = tasksArray[i].new_house_number;
        //                        if (tasksArray[i].Type == 1 || tasksArray[i].Type == 3) { //isuf
        //                            stat4TasksArray[stat4TasksArrayIndex]["contractId"] = tasksArray[i].new_contractid;
        //                            stat4TasksArray[stat4TasksArrayIndex]["contactPhoneNumber"] = tasksArray[i].new_contact_main_phone;
        //                            stat4TasksArray[stat4TasksArrayIndex]["fromHour"] = tasksArray[i].new_collection_from_hour;
        //                            stat4TasksArray[stat4TasksArrayIndex]["toHour"] = tasksArray[i].new_collection_to_hour;
        //                        } else { // mesira                            
        //                            stat4TasksArray[stat4TasksArrayIndex]["contractId"] = tasksArray[i].new_account_number;
        //                            stat4TasksArray[stat4TasksArrayIndex]["contactPhoneNumber"] = tasksArray[i].new_primary_telephone2;
        //                            stat4TasksArray[stat4TasksArrayIndex]["fromHour"] = tasksArray[i].new_delivery_from_hour;
        //                            stat4TasksArray[stat4TasksArrayIndex]["toHour"] = tasksArray[i].new_delivery_until_hour;
        //                        }
        //                        stat4TasksArrayIndex++;
        //                    }
        //                }
        //            }//end for

        //            $('.miyunPopup1 .loginBtn').hide();
        //            if (tasksCounter > 0) {
        //                $.magnificPopup.open({
        //                    items: {
        //                        src: $('#popupMsg'),
        //                        type: 'inline',
        //                        showCloseBtn: false
        //                    }
        //                });
        //                $('#popupMsg > div:first-of-type .loginBtn').show();
        //                //console.log('magnificPopup has been opened');
        //            }
        //            else if (hasStat4Tasks == true && isManualCall == true) {
        //                //console.log('to assignments_all');
        //                //location.href = "#/assignments_all" + stat4TasksArray;
        //                location.href = "#/assignments_all";
        //            } else if (isManualCall == true) {
        //                location.href = "#/assignments_empty";
        //            } else {
        //                $('#closeBtn_12').trigger('click');
        //            }
        //        }
        //    }



        //    function createTaskDiv(index, taskType, taskStat, contractNumber, contactName, contactPhoneNumber, fromHour, toHour, city, street, houseNumber, taskId, caseNumber, new_barkod) {

        //        if ((fromHour == "" || typeof (fromHour) == 'object') && (toHour == "" || typeof (toHour) == 'object')) {
        //            fromHour = "23:01";
        //            toHour = "23:59";
        //        }

        //        if (!(fromHour == "" || typeof (fromHour) == 'object') && (toHour == "" || typeof (toHour) == 'object')) {
        //            toHour = "20:00";
        //        }

        //        if ((fromHour == "" || typeof (fromHour) == 'object') && !(toHour == "" || typeof (toHour) == 'object')) {
        //            fromHour = "07:59";
        //        }

        //        var taskDescription, titleClass;
        //        if (taskType == 1 || taskType == 3) {
        //            taskDescription = 'איסוף';
        //            caseNumber = 'פנייה מספר ' + caseNumber;
        //            titleClass = 'newItempopTitleCollect';
        //        } else {
        //            taskDescription = 'מסירה';
        //            titleClass = 'newItempopTitle';
        //        }
        //        var taskDiv = "taskDIV" + index;
        //        var subscriberName = getSubscriberName(contractNumber);
        //        var subscriberId = 'מנוי ' + contractNumber;
        //        //console.log(index, taskType, taskStat, contractNumber, contactName, contactPhoneNumber, fromHour, toHour, city, street, houseNumber, taskId, caseNumber);
        //        var divhtml = '<div id="' + taskDiv + '">';
        //        divhtml += '<div class="miyunPopup1"><div class="shiyuchPopupInner4"><div class="closePop" id="closeBtn_' + index + '"><img src="images/closePopup.png" alt=""/></div>';
        //        divhtml += '<div class="' + titleClass + '">' + taskDescription + '<br><span>' + subscriberName + '</span></div>' + ' ' + subscriberId + '<br><strong>' + fromHour + ' - ' + toHour + '</strong>';
        //        divhtml += '<div>' + caseNumber + new_barkod + '</div>';
        //        divhtml += '<div class="assign_innerDetails"><div class="assign_innrtDetailsRight"><strong>' + city + '</strong><br>' + street + ' ' + houseNumber + '</div>';
        //        divhtml += '<div class="assign_innrtDetailsLeft"><strong>' + contactName + '</strong><br>' + contactPhoneNumber + '</div></div>';
        //        divhtml += '<form id="assignment_new_item" class="form_with_radio"><div class="popupradioBtns">';
        //        divhtml += '<div class="radioBtn"><input id="radio1_' + index + '" type="radio" name="radio_' + index + '" value="1" checked="checked"><label for="radio1_' + index + '"><span><span></span></span>אישור</label></div>';
        //        divhtml += '<div class="radioBtn"><input id="radio2_' + index + '" type="radio" name="radio_' + index + '" value="2"><label for="radio2_' + index + '"><span><span></span></span>דחיה</label></div></div>';
        //        divhtml += '<div class="BarcodeFields selectInput"><div class="selectInputfield"><select class="area" id="select' + index + '" name="area">';
        //        divhtml += '<option class="areainput" value="" disabled selected>סיבת הדחיה</option>';
        //        divhtml += '<option class="areainput" value="1">נמצא באזור חלוקה אחר</option>';
        //        divhtml += '<option class="areainput" value="2">לא שייך לאזור שלי</option>';
        //        divhtml += '<option class="areainput" value="3">לא אצליח להגיע בזמן</option>';
        //        divhtml += '<option class="areainput" value="4">אין מקום ברכב</option></select>';
        //        divhtml += '</div></div></form><div class="loginBtn" id="btn_' + index + '"><a class="popup_close_button">סיום</a></div></div>';
        //        //console.log("divhtml= " + divhtml);

        //        $('#popupMsg').append(divhtml);

        //        //bind "send" button
        //        $('#btn_' + index).on("click", function () {
        //            sendMSG21(index, taskId, taskDiv, taskStat, isManualCall);
        //            setTimeout(function () {
        //                $('#popupMsg > div:first-of-type .loginBtn').show();
        //            }, 1000)
        //        });

        //        //bind "close" button
        //        $('#closeBtn_' + index).on("click", function () {
        //            $('#' + taskDiv).remove();
        //            //console.log('task ' + taskDiv + ' removed from the DOM');
        //            if ($('#popupMsg > div').length == 0) {
        //                $.magnificPopup.close();
        //                if (hasStat4Tasks == false && isManualCall == true) {
        //                    //console.log('to assignments_empty');
        //                    location.href = "#/assignments_empty";
        //                } else if (isManualCall == true) {
        //                    //console.log('to assignments_all');
        //                    location.href = "#/assignments_all";
        //                }
        //            } else {
        //                $('#popupMsg > div:first-of-type .loginBtn').show();
        //            }
        //        });
        //    }
        //}

        //function sendMSG21(index, taskId, taskDiv, taskStat, isManualCall) {

        //    //console.log('sendMSG21 ' + index, taskId, taskDiv, taskStat);
        //    var date = getCurrentDate();
        //    var userAction;
        //    if ($("#radio1_" + index).is(":checked")) {
        //        userAction = "accept";
        //    } else {
        //        userAction = "reject";
        //    }
        //    var rejectReason = $("#select" + index).val();
        //    if (rejectReason == null) {
        //        rejectReason = '';
        //    }
        //    var validated = true;
        //    if (userAction == "reject" && rejectReason == '') {
        //        validated = false;
        //        navigator.notification.alert('עליך לבחור סיבת דחייה');
        //    }

        //    if (validated) {
        //        var stat, reason = '';
        //        if (taskStat == 1 || taskStat == 2) { // in this case only, send message 21 with STAT=3
        //            createMSG21(3, taskId, date);
        //        }

        //        var consoleMsg = '';
        //        if (userAction == "accept") { //accept task
        //            stat = 4;
        //            consoleMsg = 'The user accepted the task.';
        //        } else { //reject task
        //            stat = 5;
        //            reason = rejectReason;
        //            consoleMsg = 'The user rejected the task, reject reason number is ' + reason + '.';
        //        }

        //        var xml =
        //            '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
        //        <soapenv:Header/>\
        //            <soapenv:Body>\
        //                <tem:'+ XMLMETHOD + '>\
        //                <!--Optional:-->\
        //                    <tem:xml>\
        //                        <![CDATA[\
        //                        <DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>21</CODE>\
        //                        <SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY/><DEVKEY/><VER>4</VER></HEADER>\
        //                                            <DATA>\
        //                            <STATUS>\
        //                                                       <TASKID>' + taskId + '</TASKID>\
        //                                                             <DT>'+ date + '</DT>\
        //                                                             <STAT>'+ stat + '</STAT>\
        //                                                             <REASON>'+ reason + '</REASON>\
        //                                                             <BC></BC><BCS></BCS>\
        //                                                   </STATUS>\
        //                                               </DATA></MSG></DATA>]]>\
        //                 </tem:xml>\
        //               </tem:'+ XMLMETHOD + '>\
        //        </soapenv:Body>\
        //    </soapenv:Envelope>';

        //        $
        //          .ajax(
        //                        {
        //                            url: serverUrl,
        //                            dataType: "xml",
        //                            type: "POST",
        //                            async: false,
        //                            contentType: "text/xml;charset=utf-8",
        //                            headers: {
        //                                "SOAPAction": SoapActionQA
        //                            },
        //                            crossDomain: true,
        //                            data: xml,
        //                            timeout: 30000 //30 seconds timeout
        //                        }).done(function (data) {
        //                            //console.log(data);
        //                            if (data != null) {
        //                                var dataXML = new XMLSerializer().serializeToString(data);
        //                                //console.log(dataXML);
        //                                var responseXML = $(dataXML).find("DataObject Data").text();
        //                                var JSONData = $.xml2json(responseXML);
        //                                if (JSONData.DATA.MSG.DATA.RESULT == 0) {
        //                                    //console.log('taskid ' + taskId + ' has been successfully reported.');
        //                                    //console.log(consoleMsg);
        //                                    navigator.notification.alert('דווח בהצלחה');
        //                                    $('#' + taskDiv).remove();
        //                                    //console.log('task ' + taskDiv + ' removed from the DOM');
        //                                    if ($('#popupMsg > div').length == 0) {
        //                                        $.magnificPopup.close();
        //                                        if (hasStat4Tasks == false && isManualCall == true) {
        //                                            //console.log('to assignments_empty');
        //                                            location.href = "#/assignments_empty";
        //                                        } else if (isManualCall == true) {
        //                                            //console.log('to assignments_all');
        //                                            //location.href = "#/assignments_all" + stat4TasksArray;
        //                                            location.href = "#/assignments_all";
        //                                        }
        //                                    }
        //                                } else {
        //                                    navigator.notification.alert(JSONData.DATA.MSG.DATA.RESMSG);
        //                                }
        //                            }//end if (data != null)                                                   
        //                        }).fail(function (jqXHR, textStatus, thrownError) {
        //                            navigator.notification.alert('אין תקשורת, נסה שנית');
        //                        });
        //    }
        //}

        //function createMSG21(stat, taskId, date) {
        //    var xml =
        //        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
        //        <soapenv:Header/>\
        //            <soapenv:Body>\
        //               <tem:'+ XMLMETHOD + '>\
        //                <!--Optional:-->\
        //                    <tem:xml>\
        //                        <![CDATA[\
        //                        <DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>21</CODE>\
        //                        <SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY/><DEVKEY/><VER>4</VER></HEADER>\
        //                                            <DATA>\
        //                            <STATUS>\
        //                                                       <TASKID>' + taskId + '</TASKID>\
        //                                                             <DT>'+ date + '</DT>\
        //                                                             <STAT>'+ stat + '</STAT>\
        //                                                             <REASON></REASON>\
        //                                                             <BC></BC>\
        //                                <BCS></BCS>\
        //                                                   </STATUS>\
        //                                               </DATA></MSG></DATA>]]>\
        //                 </tem:xml>\
        //               </tem:'+ XMLMETHOD + '>\
        //        </soapenv:Body>\
        //    </soapenv:Envelope>';

        //    $
        //         .ajax(
        //                       {
        //                           url: serverUrl,
        //                           dataType: "xml",
        //                           type: "POST",
        //                           async: false,
        //                           contentType: "text/xml;charset=utf-8",
        //                           headers: {
        //                               "SOAPAction": SoapActionQA
        //                           },
        //                           crossDomain: true,
        //                           data: xml,
        //                           timeout: 30000 //30 seconds timeout
        //                       }).done(function (data) {
        //                           //console.log(data);
        //                           if (data != null) {
        //                               var dataXML = new XMLSerializer().serializeToString(data);
        //                               //console.log(dataXML);
        //                               var responseXML = $(dataXML).find("DataObject Data").text();
        //                               var JSONData = $.xml2json(responseXML);
        //                               if (JSONData.DATA.MSG.DATA.RESULT != 0) {
        //                                   navigator.notification.alert(JSONData.DATA.MSG.DATA.RESMSG);
        //                               }
        //                           } else {
        //                               navigator.notification.alert('יש תקלה בשרת');
        //                           }//end if (data != null)                                                   
        //                       }).fail(function (jqXHR, textStatus, thrownError) {
        //                           navigator.notification.alert('אין תקשורת, נסה שנית');
        //                       });
        //}
    }
})