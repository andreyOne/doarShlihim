scotchApp.controller('forgetPassController', function ($scope) {
$("#warpPopup").hide()

    $scope.onForgetPassword = function () {
        resetPass();
    };

    $scope.$on('$routeChangeStart', function (next, current) {
        $.sidr('close');
    });
});

var MesimatMesiraObject;
var MesiraMerukezetPicturesArray = [];

var RQPGLOBAL;
var RQWGLOBAL;

var serverUrl = "https://cg.israelpost.co.il:9464/WcfShlihimPhoneDocs";

//production
//var serverUrl = "https://193.46.64.172:449/WcfShlihimPhoneDocs";

//var XMLMETHOD = "ServerMessageQA"; // our link
//var SoapActionQA = "http://tempuri.org/IService1/ServerMessageQA"

var XMLMETHOD = "ServerMessage";
var SoapActionQA = "http://tempuri.org/IService1/ServerMessage"

function getCurrentDate() {
    //04/11/2015 14:53:34
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    month += 1;
    if (month < 10) {
        month = "0" + month;
    }

    if (day < 10) {
        day = "0" + day;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    var str = day + "/" + month + "/" + date.getFullYear() + " " + hours + ":" + minutes + ":" + seconds;
    return str;
};


function displayErrorMessage(errorMessageToDisplay) {
    navigator.notification.alert(errorMessageToDisplay);
}

function validateManaualCode(manualcode) {
    //must have exactly 13 chars
    //first 2 chars must be alphanumeric
    //next 9 chars must be numeric
    //last 2 chars must be letters
    var errorManualCode1 = 'מספר התווים בברקוד חייב להיות 13';
    var errorManualCode2 = '2 התווים הראשונים חייבים להיות אלפא-נומריים';
    var errorManualCode3 = '9 התווים האמצעיים חייבים להיות נומריים';
    var errorManualCode4 = '2 התווים האחרונים חייבים להיות אלפא-נומריים';
    var errorManualCode5 = 'אסור להכניס רווחים';
    var errorMessageToDisplay = '';
    var barcodeExpectedLength = 13;
    var validated = true;
    if (manualcode.indexOf(' ') >= 0)
    { errorMessageToDisplay = errorManualCode5; validated = false; }
    if (validated == true && manualcode.length != barcodeExpectedLength)
    { errorMessageToDisplay = errorManualCode1; validated = false; }
    if (validated == true && (/[^a-zA-Z0-9]/.test(manualcode.substring(0, 2))))
    { errorMessageToDisplay = errorManualCode2; validated = false; }
    if (validated == true && !(/^\d+$/.test(manualcode.substring(2, 11))))
    { errorMessageToDisplay = errorManualCode3; validated = false; }
    if (validated == true && (/[^a-zA-Z0-9]/.test(manualcode.substring(11, 13))))
    { errorMessageToDisplay = errorManualCode4; validated = false; }
    if (validated == false) {
        console.log('manual barcode error: ' + errorMessageToDisplay);
        displayErrorMessage(errorMessageToDisplay);
    }
    return validated;
}

function createLoginSoapMessage(userid, oldpass, newpass) {
            var USRKEY = localStorage.getItem("USRKEY");

            var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/"><soapenv:Header/><soapenv:Body><tem:' + XMLMETHOD + '><!--Optional:--><tem:xml><![CDATA[<DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>16</CODE><SENDTIME>03/11/2015 09:18:11</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY>  <DEVKEY></DEVKEY><VER>4</VER></HEADER><DATA><USERID>' + userid + '</USERID><PWD>' + newpass + '</PWD><OLPWD>' + oldpass + '</OLPWD></DATA></MSG></DATA>]]></tem:xml></tem:' + XMLMETHOD + '></soapenv:Body></soapenv:Envelope>';
    console.log(xml);
    return xml;
}
function resetPass() {
    var oldPass = $(".oldpass").val();
    var userId = $(".userinput").val();
    var newPass = $(".passinput").val();
    if (userId.length != 9) {
        navigator.notification.alert('יש להכניס ת.ז בעלת 9 ספרות');
        return;
    }
    if (isNaN(userId)) {
        navigator.notification.alert('יש להכניס רק תווים נומרים');
    }
    else {
        if (userId.length > 9) {
            navigator.notification.alert('יש להזין מקסימום 9 בשם משתמש ספרות');
        }
        else {
            if (isNaN(newPass)) {
                navigator.notification.alert('יש להכניס רק תווים נומרים');
            }
            else {
                if (newPass.length != 6) {
                    navigator.notification.alert('יש להזין 6 ספרות בסיסמה ');
                }
                else {

                    var soapMessage = createLoginSoapMessage(userId, oldPass, newPass)
                    $.ajax({
                        url: serverUrl,
                        dataType: "xml",
                        //dataType: 'json',
                        type: "POST",
                        async: false,
                        contentType: "text/xml;charset=utf-8",
                        headers: {"SOAPAction": SoapActionQA},
                        crossDomain: true,
                        data: soapMessage,
                        timeout: 30000 //30 seconds timeout
                    }).done(function (data) {
                        if (data != null) {
                            var parser = new DOMParser();
                            var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.textContent, "text/xml");
                            var apprv = xmlDoc.firstChild.firstChild.childNodes[1].childNodes[0].innerHTML;
                            var reason = xmlDoc.firstChild.firstChild.childNodes[1].childNodes[1].innerHTML;

                            if (apprv == "1") {
                                navigator.notification.alert(reason);
                            }
                            else {
                                navigator.notification.alert('הסיסמה שונתה בהצלחה!');
                                location.href = "#/distribution";
                            }
                        }
                        else {
                            navigator.notification.alert('יש תקלה בשרת');
                        }

                    }).fail(function (jqXHR, textStatus, thrownError) {
                        navigator.notification.alert('אין תקשורת, נסה שנית');
                    });

                }

            }
        }
    }
}