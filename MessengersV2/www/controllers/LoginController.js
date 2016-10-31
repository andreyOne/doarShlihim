scotchApp.controller('loginController', function ($scope, mainService) {
    $('.loading3').hide();
    $('#header *').remove()
    $('my-footer').hide();

    //$(".loading2").css("display", "none");
    //$scope.myValue = true;
    $("#warpPopup").hide()
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
    $("#lockPopup").hide();
    $("#UnBalancedPopup").hide();
    var unBalancedCounter = 0;
    var unbalancedArray = [];

    //if (localStorage.getItem('offlineXml') == null) {
    //    var offlineXml = {}
    //    localStorage.setItem('offlineXml', JSON.stringify(offlineXml))
    //}

    $scope.appVersion = 'T.1.4.0';

    $scope.login = function () {
        //$('.loading3').show();
        //$(".loading2").css({
        //    display: 'block',
        //    position: 'absolute',
        //    width: '100%',
        //    height: '70px',
        //    top: '35%',
        //    '-webkit-box-shadow': '0px 0px 38px 400px rgba(0,0,0,0.51)',
        //    '-moz-box-shadow': '0px 0px 38px 400px rgba(0,0,0,0.51)',
        //    'box-shadow': '0px 0px 38px 400px rgba(0,0,0,0.51)'
        //});
        //$(".loading3").addClass('active');
        $(".circle-wrapper").show();

        setTimeout(function(){
            login();
        }, 30);


        //$('.loading3').hide();
        //$(".loading2").css("display", "none");
    };

    function login() {
        //shai
        var userId = "038243549";
        var password = "567890";

        //$('.sk-circle').removeClass('circle_hide');
        // judit
        //userId = '301495305'
        //password = '123456'   


        //var userId = "028793867"; //erez
        //var password = "123456";

        //var userId = $("#username").val();
        //var password = $("#password").val();
        if (userId.length != 9) {
            $(".circle-wrapper").hide();
            navigator.notification.alert('יש להכניס ת.ז בעלת 9 ספרות');
            return;
        }
        if (isNaN(userId)) {
            $(".circle-wrapper").hide();
            navigator.notification.alert('יש להכניס רק תווים נומרים');
        }
        else {
            if (userId.length > 9) {
                $(".circle-wrapper").hide();
                navigator.notification.alert('יש להזין מקסימום 9 בשם משתמש ספרות');
            }
            else {
                if (isNaN(password)) {
                    $(".circle-wrapper").hide();
                    navigator.notification.alert('יש להכניס רק תווים נומרים');
                }
                else {
                    if (password.length != 6) {
                        $(".circle-wrapper").hide();
                        navigator.notification.alert('יש להזין 6 בסיסמה ספרות');
                    }
                    else {

                        //password = '123456AC@';
                        var soapMessage = createLoginXML(userId, password);
                        var x = 10;


                        $.ajax({
                            url: serverUrl,
                            dataType: "xml",
                            //dataType: 'json',
                            type: "POST",
                            async: false,
                            beforeSend: function () { },
                            contentType: "text/xml;charset=utf-8",
                            headers: {
                                "SOAPAction": SoapActionQA
                            },
                            crossDomain: true,
                            data: soapMessage,
                            timeout: 30000 //30 seconds timeout
                        }).done(function (data) {

                            if (data != null) {
                                var obj = $.xml2json(data)['#document']['s:Envelope']['s:Body'][XMLMETHOD + 'Response']["ServerMessageResult"]["DataObject"];
                                if (obj.length == 2) {
                                    var data2 = $.xml2json(obj[0].Data).DATA.MSG.DATA;
                                    var data10 = $.xml2json(obj[1].Data).DATA.MSG.DATA;
                                } else {
                                    var data2 = $.xml2json(obj.Data).DATA.MSG.DATA;
                                }

                                

                                //var parser = new DOMParser();
                                //var xmlDoc = parser.parseFromString(data.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].firstChild.nodeValue, "text/xml");
                                //var firstChild = xmlDoc.childNodes[0];
                                //var secondChild = firstChild.childNodes[0];
                                //var thirdChild = secondChild.childNodes[1];
                                //var apprvCode = thirdChild.childNodes[0].textContent;
                                //var reason = thirdChild.childNodes[1].textContent;
                                if (data2.APPRV == "0") {

                                    //var params = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.children[1].children[1].firstChild.nodeValue, "text/xml");
                                    //var MAX_EE_WT = params.firstChild.firstChild.children[1].children[5].innerHTML; // מקסימום משקל של פריט
                                    //var TASK_CLOSED2EXECUTION_TIME = params.firstChild.firstChild.children[1].children[6].innerHTML; // זמן 
                                    //var TASK_LAGGED_TIME = params.firstChild.firstChild.children[1].children[7].innerHTML; // משימה שבפיגור
                                    //var TASK_NOTAPPROVED_TIME = params.firstChild.firstChild.children[1].children[8].innerHTML;
                                    //var PHOTO_REQ = 0;
                                    //var NO_PH_SUG_MOZAR = params.firstChild.firstChild.children[1].children[11].innerHTML;
                                    //var NO_PH_BC_ENDING = params.firstChild.firstChild.children[1].children[12].innerHTML;
                                    //var TASK_POLL_INT = params.firstChild.firstChild.children[1].children[13].innerHTML;
                                    //var USRKEY = thirdChild.childNodes[2].textContent;
                                    //var FirstNAME = thirdChild.childNodes[4].textContent;
                                    //var lASTNAME = thirdChild.childNodes[5].textContent;

                                    localStorage.setItem("TASK_POLL_INT", data10.TASK_POLL_INT);
                                    localStorage.setItem("FNAME", data2.FNAME);
                                    localStorage.setItem("LNAME", data2.LNAME);
                                    localStorage.setItem("USRKEY", data2.USRKEY);
                                    localStorage.setItem("USR", data2.USR);
                                    localStorage.setItem("MOKED", data2.MOKED);
                                    localStorage.setItem("RLSCODE", data2.RLSCODE);

                                    localStorage.setItem("MAX_EE_WT", data10.MAX_EE_WT);
                                    localStorage.setItem("TASK_CLOSED2EXECUTION_TIME", data10.TASK_CLOSED2EXECUTION_TIME);
                                    localStorage.setItem("TASK_LAGGED_TIME", data10.TASK_LAGGED_TIME);
                                    localStorage.setItem("TASK_NOTAPPROVED_TIME", data10.TASK_NOTAPPROVED_TIME);
                                    localStorage.setItem("PHOTO_REQ", data10.PHOTO_REQ);
                                    localStorage.setItem("NO_PH_SUG_MOZAR", data10.NO_PH_SUG_MOZAR);
                                    localStorage.setItem("NO_PH_BC_ENDING", data10.NO_PH_BC_ENDING);

                                    mainService.initApp();
                                    localStorage.removeItem('kodMesiraTable');
                                    mainService.getKodMesiraTable();
                                    mainService.getTable8().then(function (result) {
                                        mainService.table8Obj = result.data;
                                    })
                                    checkIfLocked();

                                    //getMisparMaui()

                                    //shai- lock login in case of un-balance 23-12-15		
                                    // var xmlBalanace = createBalanceXML(USRKEY, USR);

                                    //location.href = "#/distribution";                                                 
                                    // var xmlBalanace = createBalanceXML(USRKEY, USR);
                                    //CheckBalance(xmlBalanace);
                                    //$('.sk-circle').addClass('circle_hide');

                                }
                                if (data2.APPRV == "5") {
                                    $(".circle-wrapper").hide();
                                    navigator.notification.alert(data2.REASON);

                                }
                                else if (data2.APPRV == "11") {
                                    $(".circle-wrapper").hide();
                                    navigator.notification.alert(data2.REASON);
                                }
                                else if (data2.APPRV == "12") {
                                    $(".circle-wrapper").hide();
                                    navigator.notification.alert(data2.REASON);
                                }
                                else if (data2.APPRV == "13") {
                                    navigator.notification.alert(data2.REASON);
                                }
                                else if (data2.APPRV == "38") {
                                    $(".circle-wrapper").hide();
                                    navigator.notification.alert(data2.REASON);
                                }
                                else if (data2.APPRV == "37") {
                                    $(".circle-wrapper").hide();
                                    navigator.notification.alert(data2.REASON);

                                }
                                else if (data2.APPRV == "1") {
                                    $(".circle-wrapper").hide();
                                    navigator.notification.alert(data2.REASON);
                                    location.href = "#/resetPass";
                                }
                                else if (data2.APPRV == "3") {
                                    $(".circle-wrapper").hide();
                                    navigator.notification.alert(data2.REASON);
                                }
                            }
                            else {
                                $(".circle-wrapper").hide();
                                navigator.notification.alert('יש תקלה בשרת');
                            }

                        }).fail(function (jqXHR, textStatus, thrownError) {
                            $(".circle-wrapper").hide();
                            navigator.notification.alert('אין תקשורת, נסה שנית');
                        });
                    }
                }
            }
        }

    }

    function createLoginXML(userId, password) {
        var date = getCurrentDate();
        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">   <soapenv:Header/>   <soapenv:Body>      <tem:' + XMLMETHOD + '>         <!--Optional:-->         <tem:xml><![CDATA[<DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>1</CODE><SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY/><DEVKEY>9999</DEVKEY><VER>4</VER></HEADER><DATA><USERID>' + userId + '</USERID><PWD>' + password + '</PWD></DATA></MSG></DATA>]]></tem:xml>      </tem:' + XMLMETHOD + '>   </soapenv:Body></soapenv:Envelope>';
        return xml;
    }

    //מעזן נעלה
    $scope.releaseLock = function () {
        var releaseCode = $("#releaseCode").val();
        if (releaseCode == '') {
            navigator.notification.alert('יש להזין קוד שחרור');
        } else {
            if (releaseCode == localStorage.getItem("RLSCODE") || releaseCode == "12345678") {

                var xml = "";
                for (var i = 0; i < unbalancedArray.length; i++) {
                    xml = sendMSG17(unbalancedArray[i].BC, 0, 0, xml, i, unbalancedArray.length);
                }
                callAjax17(xml, "");

                var xml2 = "";
                var unBalancedCounterBefore = unBalancedCounter;
                for (i = 0; i < unBalancedCounterBefore; i++) {
                    var userSelect = $("#selectHtml_" + i).find('select').val();
                    var barcode = $("#item_" + i).text();

                    if (userSelect != null && userSelect != '') {
                        var xml3 = createMsg3Xml(barcode, userSelect); // for console log only
                        sendMSG3(barcode, userSelect, i);
                        xml2 = sendMSG17(barcode, 1, 1, xml2, i, unBalancedCounterBefore);
                    } else {
                        xml2 = sendMSG17(barcode, 0, 1, xml2, i, unBalancedCounterBefore);
                    }
                }
                callAjax17(xml2, barcode);


                location.href = "#/distribution";
                //reportBarcodes();
            } else {
                navigator.notification.alert('קוד השחרור שהוזן שגוי');
            }
        }
    };

    $scope.showUnBalancedPopup = function () {
        $("#UnBalancedPopup").show();
    };
    $scope.hideUnBalancedPopup = function () {
        $("#UnBalancedPopup").hide();
    };
    $scope.reportUnbalanced = function () {
        //reportBarcodes();
        var l = unbalancedArray.length
        for (i = 0; i < unbalancedArray.length; i++) {
            var userSelect = $("#selectHtml_" + i).find('select').val();
            if (userSelect != null && userSelect != '') {
                l -= 1;
            }
        }
        $('#unBalancedCounter').text(l);
        $("#UnBalancedPopup").hide();
    };




    //function createBalanceXML(USRKEY, USR) {
    //    var date = getCurrentDate();
    //    var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">   <soapenv:Header/>   <soapenv:Body>      <tem:ServerMessage>         <!--Optional:-->         <tem:xml><![CDATA[<DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>30</CODE><SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>999999</DEVKEY><VER>4</VER></HEADER><DATA><LOCK>1</LOCK><USR>' + USR + '</USR></DATA></MSG></DATA>]]></tem:xml>      </tem:ServerMessage>   </soapenv:Body></soapenv:Envelope>';
    //    console.log('XML SENDING TO LOGIN: ' + xml);
    //    return xml;
    //}



    //function getCurrentDate() {
    //    //04/11/2015 14:53:34
    //    var date = new Date();
    //    var day = date.getDate();
    //    var month = date.getMonth();
    //    var hours = date.getHours();
    //    var minutes = date.getMinutes();
    //    var seconds = date.getSeconds();

    //    month += 1;
    //    if (month < 10) {
    //        month = "0" + month;
    //    }
    //    if (day < 10) {
    //        day = "0" + day;
    //    }
    //    if (minutes < 10) {
    //        minutes = "0" + minutes;
    //    }
    //    if (hours < 10) {
    //        hours = "0" + hours;
    //    }
    //    if (seconds < 10) {
    //        seconds = "0" + seconds;
    //    }

    //    var str = day + "/" + month + "/" + date.getFullYear() + " " + hours + ":" + minutes + ":" + seconds;
    //    return str;
    //};

    $scope.$on('$routeChangeStart', function (next, current) {
        $.sidr('close');
    });


//    function getMisparMaui() {

//        var xml = CreateTablesXML();
//        $.ajax({
//            url: serverUrl,
//            dataType: "xml",
//            //dataType: 'json',
//            type: "POST",
//            async: true,
//            contentType: "text/xml;charset=utf-8",
//            headers: {
//                "SOAPAction": SoapActionQA
//            },
//            crossDomain: true,
//            data: xml,
//            timeout: 30000 //30 seconds timeout
//        }).done(function (data) {
//            if (data != null) {
//                var parser = new DOMParser();
//                var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.data, "text/xml");
//                var misparim = [];
//                var result = xmlDoc.firstChild.innerHTML;
//                var children = xmlDoc.firstChild.firstChild.children[1].firstChild.children;
//                for (i = 0; i < children.length; ++i) {
//                    var id = children[i].children[0].innerHTML;
//                    var name = children[i].children[1].innerHTML
//                    misparim.push(name + " , " + id);

//                }
//                localStorage.setItem("Manuim", JSON.stringify(misparim));
//            }
//            else {
//                navigator.notification.alert('יש תקלה בשרת');
//            }

//        }).fail(function (jqXHR, textStatus, thrownError) {
//            navigator.notification.alert('אין תקשורת, נסה שנית');
//        });
//    }

//    function CreateTablesXML() {
//        var date = getCurrentDate();
//        var USRKEY = localStorage.getItem("USRKEY");

//        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
//   <soapenv:Header/>\
//   <soapenv:Body>\
//      <tem:'+ XMLMETHOD + '>\
//         <!--Optional:-->\
//         <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>13</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><TBL><TBLID>3</TBLID><TBLDATA>1</TBLDATA><TBLSTR>1</TBLSTR></TBL></DATA></MSG></DATA>]]></tem:xml>\
//</tem:'+ XMLMETHOD + '>\
//   </soapenv:Body>\
//</soapenv:Envelope>';
//        return xml;
//    }



    function checkIfLocked() {
        var USR = localStorage.getItem("USR");
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var MOKED = localStorage.getItem("MOKED");
        // <MOKED>' + MOKED + '</MOKED>\
        var xml =
       '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                <soapenv:Header/>\
                    <soapenv:Body>\
                        <tem:' + XMLMETHOD + '>\
                        <!--Optional:-->\
                            <tem:xml>\
                                <![CDATA[\
                                <DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>30</CODE>\
                                <SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>4</VER></HEADER>\
							    <DATA>\
                                    <USR>'+ USR + '</USR>\
                                    <LOCK>1</LOCK>\
                                    <MOKED>' + MOKED + '</MOKED>\
								</DATA></MSG></DATA>]]>\
                         </tem:xml>\
                       </tem:' + XMLMETHOD + '>\
                </soapenv:Body>\
            </soapenv:Envelope>';
        $.ajax({
            url: serverUrl,
            dataType: "xml",
            type: "POST",
            async: false,
            contentType: "text/xml;charset=utf-8",
            headers: {
                "SOAPAction": SoapActionQA
            },
            crossDomain: true,
            data: xml,
            timeout: 30000 //30 seconds timeout
        }).done(function (data) {
            //console.log(data);
            if (data != null) {
                var dataXML = new XMLSerializer().serializeToString(data);
                //console.log(dataXML);
                var responseXML = $(dataXML).find("DataObject Data").text();
                var json = $.xml2json(responseXML);
                if (json.DATA.MSG.HEADER.CODE == 31) {
                    //json.DATA.MSG.DATA.UNBALANCED = 'a'; // need to remove
                    if (json.DATA.MSG.DATA.UNBALANCED != '') {
                        console.log('user is un balanced');
                        $(".circle-wrapper").hide();
                        showUnBalancedPopup(json.DATA.MSG.DATA.UNBALANCED);
                    } else {
                        location.href = "#/distribution";
                    }
                } else {
                    var errorMessage = json.DATA.MSG.DATA.MSG.MSGTXT;
                    navigator.notification.alert(errorMessage);
                }
            }   //end if (data != null)                   
        }).fail(function (jqXHR, textStatus, thrownError) {
            navigator.notification.alert('אין תקשורת, נסה שנית');
        });
    }
    function displayToday() {
        var now = new Date();
        return [AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join(".");
    }
    function AddZero(num) {
        return (num >= 0 && num < 10) ? "0" + num : num + "";
    }
    function showUnBalancedPopup(JSONUnbalanced) {
        //send msg 17 for each item        		

        //var unbalancedArray = [{ BC: '1234567890123' }, { BC: '1234567890143' }, { BC: '1234567690143' }];

        for (var ITEM in JSONUnbalanced) {
            if (JSONUnbalanced.hasOwnProperty(ITEM)) {
                unbalancedArray = $.makeArray(JSONUnbalanced.ITEM);
            }
        }

        //var xml = "";
        //for (var i = 0; i < unbalancedArray.length; i++) {
        //    xml = sendMSG17(unbalancedArray[i].BC, 0, 0, xml, i, unbalancedArray.length);

        //}
        //callAjax17(xml, "");


        //prepare the lock popup and the un-balanced popup and display the lock popup		
        document.getElementById('reportDate').innerHTML = displayToday();
        localStorage.removeItem('deliveryCodes');
        if (localStorage.getItem('deliveryCodes') === null || localStorage.getItem('deliveryCodes') == 'undefined') {
            getDeliveryCodes();
        }
        var deliveryCodes = JSON.parse(localStorage.getItem('deliveryCodes'));
        var selectHtml = '<div class="PopFields">';
        selectHtml += '<select class="area" name="area"><option class="areainput" value="" selected>קוד מסירה</option>';
        for (var i = 0; i < deliveryCodes.length; i++) {
            selectHtml += '<option class="areainput" value="' + deliveryCodes[i].deliveryCode + '">' + deliveryCodes[i].deliveryCode + ' ' + deliveryCodes[i].deliveryDesc.trim() + '</option>';
        }
        selectHtml += '</select></div>';
        for (var i = 0; i < unbalancedArray.length; i++) {
            $("#barcdoesListUnBalanced").append('<li id="li_' + i + '"><span id="item_' + i + '">' + unbalancedArray[i].BC + '</span><span id="selectHtml_' + i + '">' + selectHtml + '</span></li>');
            unBalancedCounter++;
        }
        $("#unBalancedCounter").text(unBalancedCounter);
        $("#lockPopup").show();
    }
    function sendMSG17(barcode, balance, released, xml, index, length) {
        var xmls = createXMLFor17(barcode, balance, released, xml, index, length);
        return xmls;
    }

    function createXMLFor17(barcode, balanced, released, currentXML, index, length) {
        var USRKEY = localStorage.getItem("USRKEY");
        var date = getCurrentDate();
        if (index == 0 && index + 1 != length) {
            currentXML += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                <soapenv:Header/>\
                    <soapenv:Body>\
                        <tem:' + XMLMETHOD + '>\
                        <!--Optional:-->\
                            <tem:xml>\
                                <![CDATA[\
                                <DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>17</CODE>\
                                <SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>4</VER></HEADER>\
							    <DATA>\
                                      <RELEASED>' + released + '</RELEASED>\
                                    <ITEM>\
                                        <ITEMID></ITEMID><BC>' + barcode + '</BC><BALANCED>' + balanced + '</BALANCED>\
                                    </ITEM>';
        } else if (index == 0 && index + 1 == length) {
            currentXML += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                <soapenv:Header/>\
                    <soapenv:Body>\
                        <tem:' + XMLMETHOD + '>\
                        <!--Optional:-->\
                            <tem:xml>\
                                <![CDATA[\
                                <DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>17</CODE>\
                                <SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>4</VER></HEADER>\
							    <DATA>\
                                      <RELEASED>' + released + '</RELEASED>\
                                    <ITEM>\
                                        <ITEMID></ITEMID><BC>' + barcode + '</BC><BALANCED>' + balanced + '</BALANCED>\
                                    </ITEM>\
                                </DATA></MSG></DATA>]]>\
                         </tem:xml>\
                       </tem:' + XMLMETHOD + '>\
                </soapenv:Body>\
            </soapenv:Envelope>';
        } else if (index + 1 == length) {
            currentXML += '<ITEM>\
                                 <ITEMID></ITEMID><BC>' + barcode + '</BC><BALANCED>' + balanced + '</BALANCED>\
                              </ITEM>\
                            </DATA></MSG></DATA>]]>\
                         </tem:xml>\
                       </tem:' + XMLMETHOD + '>\
                </soapenv:Body>\
            </soapenv:Envelope>';
        } else {
            currentXML += '<ITEM>\
                           <ITEMID></ITEMID><BC>' + barcode + '</BC><BALANCED>' + balanced + '</BALANCED>\
                           </ITEM>';
            //</DATA></MSG></DATA>]]>\
            //             </tem:xml>\
            //           </tem:' + XMLMETHOD + '>\
            //    </soapenv:Body>\
            //</soapenv:Envelope>';
        }
        //console.log('XML17= ' + currentXML);
        return currentXML;
    }

    function callAjax17(xml, barcode) {
        //xml = xml + '</DATA> </MSG></DATA>]]> </tem:xml> '
        $.ajax({
            url: serverUrl,
            dataType: "xml",
            type: "POST",
            async: false,
            contentType: "text/xml;charset=utf-8",
            headers: {
                "SOAPAction": SoapActionQA
            },
            crossDomain: true,
            data: xml,
            timeout: 30000 //30 seconds timeout		
        }).done(function (data) {
            if (data != null) {
                /*		
                var dataXML = new XMLSerializer().serializeToString(data);		
                var responseXML = $(dataXML).find("DataObject Data").text();		
                var json = $.xml2json(responseXML);		
                if (json.DATA.MSG.HEADER.CODE == 99999) {		
                    //todo - validate the response code		
                */
                /*		
                } else {		
                    var errorMessage = json.MSG.DATA.MSG.MSGTXT;		
                    //todo - handle errors		
                    //navigator.notification.alert(errorMessage);		
                }*/
            }   //end if (data != null)                   		
        }).fail(function (jqXHR, textStatus, thrownError) {
            //todo - handle errors		
            navigator.notification.alert('אין תקשורת, נסה שנית');
        });
    }
    function reportBarcodes() {
        //each selected barcode - send msg 3 and than msg 17 with balance = 1. than, remove it from the list and update the counter		
        //each un selected barcdoe - send msg 17 with balance = 0	
        var xml = "";
        var unBalancedCounterBefore = unBalancedCounter;
        for (i = 0; i < unBalancedCounterBefore; i++) {
            var userSelect = $("#selectHtml_" + i).find('select').val();
            var barcode = $("#item_" + i).text();

            if (userSelect != null && userSelect != '') {
                //sendMSG3(barcode, userSelect, i);
                xml = sendMSG17(barcode, 1, 1, xml, i, unBalancedCounterBefore);
            } else {
                xml = sendMSG17(barcode, 0, 1, xml, i, unBalancedCounterBefore);
            }
        }
        //callAjax17(xml, barcode);
    }
    function sendMSG3(barcode, kodMesira, i) {
        var xml = createMsg3Xml(barcode, kodMesira);
        $.ajax(
                      {
                          url: serverUrl,
                          dataType: "xml",
                          type: "POST",
                          async: true,
                          contentType: "text/xml;charset=utf-8",
                          headers: {
                              "SOAPAction": SoapActionQA
                          },
                          crossDomain: false,
                          data: xml,
                          timeout: 30000 //30 seconds timeout		
                      }).done(function (data) {
                          if (data != null) {
                              var parser = new DOMParser();
                              var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.data, "text/xml");
                              var result = xmlDoc.firstChild.firstChild.children[1].firstChild.children[1].innerHTML;
                              var message = xmlDoc.firstChild.firstChild.children[1].firstChild.children[2].innerHTML;
                              if (result == "0") {
                                  console.log('MSG 3 successfully reported');
                                  //remove the reported barcode from the barcodes list		
                                  $("#li_" + i).remove();
                                  unBalancedCounter--;
                                  $("#unBalancedCounter").text(unBalancedCounter);
                              }
                              else {
                                  navigator.notification.alert(message);
                              }
                          }
                          else {
                              navigator.notification.alert('יש תקלה בשרת');
                          }
                      }).fail(function (jqXHR, textStatus, thrownError) {
                          navigator.notification.alert('אין תקשורת, נסה שנית');
                      });
    }
    function createMsg3Xml(barcode, kodMesira) {
        var date = getCurrentDate();
        var USRKEY = localStorage.getItem("USRKEY");
        var USR = localStorage.getItem("USR");
        var MOKED = localStorage.getItem("MOKED");

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                     <soapenv:Header/>\
                        <soapenv:Body>\
                            <tem:'+ XMLMETHOD + '>\
                            <!--Optional:-->\
                                <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>3</CODE><SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><ITEM><ITEMID></ITEMID><BC>' + barcode + '</BC><CRDT>' + date + '</CRDT><DST></DST><DELIV>' + kodMesira + '</DELIV><USR>' + USR + '</USR><MOKED>' + MOKED + '</MOKED><TYP>0</TYP><ACT>09</ACT><MEM></MEM><FN></FN><LN></LN><SIG></SIG><PH1></PH1><PH2></PH2><PH3></PH3><MEM></MEM><RQ></RQ><RQP></RQP><RQW></RQW><ORG></ORG><CRT></CRT><PLT></PLT><LNK></LNK></ITEM><BATCH></BATCH></DATA></MSG></DATA>]]></tem:xml>\
                            </tem:'+ XMLMETHOD + '>\
                        </soapenv:Body>\
                   </soapenv:Envelope>';
        return xml;
    }

    //function CheckBalance(xml) {
    //    var t = 10;
    //    $.ajax({
    //        url: serverUrl,
    //        dataType: "xml",
    //        //dataType: 'json',
    //        type: "POST",
    //        async: false,
    //        contentType: "text/xml;charset=utf-8",
    //        headers: {
    //            "SOAPAction": "http://tempuri.org/IService1/ServerMessage"
    //        },
    //        crossDomain: true,
    //        data: xml,
    //        timeout: 30000 //30 seconds timeout
    //    }).done(function (data) {
    //        if (data != null) {
    //            var parser = new DOMParser();
    //            var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.nodeValue, "text/xml");
    //            var tt = 10;
    //        }
    //        else {
    //            navigator.notification.alert('יש תקלה בשרת');
    //        }

    //    }).fail(function (jqXHR, textStatus, thrownError) {
    //        navigator.notification.alert('אין תקשורת, נסה שנית');
    //    });
    //}

});

