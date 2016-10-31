function getDeliveryCodes() {
    /*check if the codes table is already loaded into the global area. 
      if yes, return from local, else invoke remote method, insert the data to local,
      and then return the value */
    if (localStorage.getItem('deliveryCodes') === null || localStorage.getItem('deliveryCodes') == 'undefined') {
        getDeliveryCodesAjax();
    }
    
    return;
}

function getDeliveryCodesAjax() {
    var date = getCurrentDate();
    var xml =
        '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                <soapenv:Header/>\
                    <soapenv:Body>\
                        <tem:' + XMLMETHOD + '>\
                        <!--Optional:-->\
                            <tem:xml>\
                                <![CDATA[\
                                <DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>13</CODE>\
                                <SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY/><DEVKEY/><VER>4</VER></HEADER>\
							    <DATA>\
                                    <TBL>\
                                        <TBLID>1</TBLID>\
                                        <TBLDATA>1</TBLDATA>\
                                        <TBLSTR>1</TBLSTR>\
                                    </TBL>\
								</DATA></MSG></DATA>]]>\
                         </tem:xml>\
                       </tem:' + XMLMETHOD + '>\
                </soapenv:Body>\
            </soapenv:Envelope>';
    console.log(xml);

    $
      .ajax(
                    {
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
                        console.log(data);
                        if (data != null) {
                            var dataXML = new XMLSerializer().serializeToString(data);
                            console.log(dataXML);
                            var responseXML = $(dataXML).find("DataObject Data").text();
                            var JSONData = $.xml2json(responseXML);
                            var deliveryCodes = JSONData.DATA.MSG.DATA.NewDataSet;
                            localStorage.setItem('deliveryCodes', JSON.stringify(deliveryCodes.Table));
                        }//end if (data != null)                                                   
                    }).fail(function (jqXHR, textStatus, thrownError) {
                        //navigator.notification.alert('אין תקשורת, נסה שנית');
                        console.log('Message #13 Fail!');
                    });

}




