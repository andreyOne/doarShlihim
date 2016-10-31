scotchApp.service('mainService', function ($http, $q) {
    var USRKEY = "";
    var USR = "";
    var MOKED = "";
    var firstName = "";
    var lastName = "";
    if (localStorage.getItem('offlineXml') == null) {
        var offlineXml = {};
        localStorage.setItem('offlineXml', JSON.stringify(offlineXml));
    }
    this.manuim = [];
    this.appIsReady = false;

    this.table8Obj = {};

    this.currentAssignment = {};

    var self = this;

    this.initApp = function () {
        USRKEY = localStorage.getItem("USRKEY") || "";
        USR = localStorage.getItem("USR") || "";
        MOKED = localStorage.getItem("MOKED") || "";
        firstName = localStorage.FNAME || "";
        lastName = localStorage.LNAME || "";

        this.setManuim();
        self.appIsReady = true;

        //setInterval(self.getOfflineArray, 3*60000);
    }


    //function executeQuery() {
    //    if ($("#popupMsg").html().length == 0) {
    //        getAssigments(false);
    //    }

    //    //offline start
    //    //p = JSON.parse(localStorage.getItem('offlineXml'));
    //    //if (Object.keys(p).length != 0) {
    //    //    for (var key in p) {
    //    //        if (p.hasOwnProperty(key)) {
    //    //            sendOfflineXml(key,p[key]);                    
    //    //        }
    //    //    }
    //    //}       
    //    //offline end

    //    self.getOfflineArray();
    //}

    //setInterval(this.getOfflineArray, 10000);

    this.getOfflineArray = function () {
        var obj = JSON.parse(localStorage.getItem('offlineXml'));
        if (Object.keys(obj).length != 0) {
            var key = Object.keys(obj)[0];
            var val = obj[key];
            self.sendOfflineXml(key, val);
        }

        //if (Object.keys(p).length != 0) {
        //    for (var key in p) {
        //        if (p.hasOwnProperty(key)) {
        //            self.sendOfflineXml(key, p[key]);
        //        }
        //    }
        //}
    }


    this.sendOfflineXml = function (key, xml) {
        self.send3(xml).then(function (response) {
            var offlineXml = JSON.parse(localStorage.getItem('offlineXml'));
            delete offlineXml[key];
            localStorage.setItem('offlineXml', JSON.stringify(offlineXml));
            setTimeout(self.getOfflineArray(),100);
        })
    }



    this.createTable8 = function () {
        var date = getCurrentDate();
        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
        <soapenv:Header/>\
           <soapenv:Body>\
              <tem:'+ XMLMETHOD + '>\
                 <!--Optional:-->\
                 <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>13</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><TBL><TBLID>8</TBLID><TBLDATA>1</TBLDATA><TBLSTR>1</TBLSTR></TBL></DATA></MSG></DATA>]]></tem:xml>\
                </tem:'+ XMLMETHOD + '>\
           </soapenv:Body>\
        </soapenv:Envelope>';
        return xml;
    }


    this.getTable8 = function () {
        return $http({
            url: serverUrl,
            method: 'POST',
            data: this.createTable8(),
            transformResponse: function (response) {
                // string -> XML document object
                return $.xml2json($.xml2json(response)['s:Envelope']['s:Body'][XMLMETHOD + 'Response'][XMLMETHOD + 'Result']['DataObject'].Data)['DATA']['MSG']['DATA']['NewDataSet']['Table'];
            },
            headers: {
                "SOAPAction": SoapActionQA,
                "Content-Type": 'application/xml',
                "Accept": "application/xml, text/xml, */*"
            }

        })
    }


    this.create32 = function (kodMesira, barcode) {
        barcode = barcode.toUpperCase();
        var date = getCurrentDate();
        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
   <soapenv:Header/>\
   <soapenv:Body>\
      <tem:'+ XMLMETHOD + '>\
         <!--Optional:-->\
         <tem:xml><![CDATA[<DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>32</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>4</VER></HEADER><DATA><USR>' + USR + '</USR><BC>' + barcode + '</BC><ACT>9</ACT><DELIV>' + kodMesira + '</DELIV><MOKED>' + MOKED + '</MOKED></DATA></MSG></DATA>]]></tem:xml>\
      </tem:'+ XMLMETHOD + '>\
   </soapenv:Body>\
</soapenv:Envelope>'
        return xml;
    }

    this.send32 = function (kodMesira, barcode) {
        return $http({
            url: serverUrl,
            method: 'POST',
            data: this.create32(kodMesira, barcode),
            headers: {
                "SOAPAction": SoapActionQA,
                "Content-Type": 'application/xml',
                "Accept": "application/xml, text/xml, */*"
            }
        })
    }

    this.getAssigments = function () {
        return $http({
            url: serverUrl,
            method: 'POST',
            data: self.createAssignmentsXml(),
            headers: {
                "SOAPAction": SoapActionQA,
                "Content-Type": 'application/xml',
                "Accept": "application/xml, text/xml, */*"
            }
        }).then(function (response) {
            var arr = [];
            var resObj = {
                "takenAssignments":[],
                "popupAssignments": []
            }
            if ($.xml2json($.xml2json(response.data)['s:Envelope']['s:Body'][XMLMETHOD + 'Response'][XMLMETHOD + 'Result']['DataObject'].Data)['DATA']['MSG']['DATA'].TASKS == "") {
                return resObj
            } else if (Array.isArray($.xml2json($.xml2json(response.data)['s:Envelope']['s:Body'][XMLMETHOD + 'Response'][XMLMETHOD + 'Result']['DataObject'].Data)['DATA']['MSG']['DATA'].TASKS.TASK)) {
                arr = $.xml2json($.xml2json(response.data)['s:Envelope']['s:Body'][XMLMETHOD + 'Response'][XMLMETHOD + 'Result']['DataObject'].Data)['DATA']['MSG']['DATA'].TASKS.TASK;
            } else {
                arr = Array($.xml2json($.xml2json(response.data)['s:Envelope']['s:Body'][XMLMETHOD + 'Response'][XMLMETHOD + 'Result']['DataObject'].Data)['DATA']['MSG']['DATA'].TASKS.TASK);
            }

            

            arr.forEach(function (value) {
                for (v in value) {
                    if (typeof (value[v]) === "object") { value[v] = "" }
                }

                var fromHour = value.Type == 1 || value.Type == 3 ? value.new_collection_from_hour : value.new_delivery_from_hour;
                var toHour = value.Type == 1 || value.Type == 3 ? value.new_collection_to_hour : value.new_delivery_until_hour;

                if (fromHour == "" && toHour == "") {
                    fromHour = "23:01";
                    toHour = "23:59";
                }

                if (fromHour != "" && toHour == "") {
                    toHour = "20:00";
                }

                if (fromHour == "" && toHour != "") {
                    fromHour = "07:59";
                }

                if (value.Type == 1 || value.Type == 3) {
                    value.new_collection_from_hour = fromHour;
                    value.new_collection_to_hour = toHour;
                } else {
                    value.new_delivery_from_hour = fromHour;
                    value.new_delivery_until_hour = toHour;
                }

                if(value.STAT == 4){
                    resObj["takenAssignments"].push(value);
                } else {
                    resObj["popupAssignments"].push(value);
                }
            })

            console.log('%s %o', 'all assignments : ', arr);

            return resObj;
        })
    }

    this.createAssignmentsXml = function () {
        var date = getCurrentDate();
        var xml =
            '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                <soapenv:Header/>\
                    <soapenv:Body>\
                        <tem:'+ XMLMETHOD + '>\
                        <!--Optional:-->\
                            <tem:xml>\
                                <![CDATA[\
                                <DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>34</CODE>\
                                <SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY> <DEVKEY>9999</DEVKEY><VER>4</VER></HEADER>\
                                                    <DATA><USR>' + USR + '</USR>\
                                <MOKED>' + MOKED + '</MOKED>\
                                                       </DATA></MSG></DATA>]]>\
                         </tem:xml>\
                       </tem:'+ XMLMETHOD + '>\
                </soapenv:Body>\
            </soapenv:Envelope>';
        return xml;
    }

    this.createAssignmentXmlToSend = function (assignment,reason) {
        var date = getCurrentDate();
        var xml =
            '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                <soapenv:Header/>\
                    <soapenv:Body>\
                        <tem:'+ XMLMETHOD + '>\
                        <!--Optional:-->\
                            <tem:xml>\
                                <![CDATA[\
                                <DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>21</CODE>\
                                <SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY/><DEVKEY/><VER>4</VER></HEADER>\
                                                    <DATA>\
                                    <STATUS>\
                                                               <TASKID>' + assignment.taskID + '</TASKID>\
                                                                     <DT>'+ date + '</DT>\
                                                                     <STAT>' + assignment.STAT + '</STAT>\
                                                                     <REASON>'+ reason + '</REASON>\
                                                                     <BC></BC><BCS></BCS>\
                                                           </STATUS>\
                                                       </DATA></MSG></DATA>]]>\
                         </tem:xml>\
                       </tem:'+ XMLMETHOD + '>\
                </soapenv:Body>\
            </soapenv:Envelope>';

        return xml;
    }

    this.sendAssignment = function (assignment,reason) {
        return $http({
            url: serverUrl,
            method: 'POST',
            data: this.createAssignmentXmlToSend(assignment, reason),
            headers: {
                "SOAPAction": SoapActionQA,
                "Content-Type": 'application/xml',
                "Accept": "application/xml, text/xml, */*"
            }
        }).then(function (response) {
            return $.xml2json($.xml2json(response.data)['s:Envelope']['s:Body'][XMLMETHOD+"Response"][XMLMETHOD+"Result"]["DataObject"].Data).DATA.MSG.DATA;
        })
    }

    this.send3assignment = function (barcode) {
        return $http({
            url: serverUrl,
            method: 'POST',
            data: self.create3assignmentXml(barcode),
            headers: {
                "SOAPAction": SoapActionQA,
                "Content-Type": 'application/xml',
                "Accept": "application/xml, text/xml, */*"
            }
        })
    }

    this.create3assignmentXml = function (barcode) {
        var date = getCurrentDate();

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                     <soapenv:Header/>\
                        <soapenv:Body>\
                            <tem:'+ XMLMETHOD + '>\
                            <!--Optional:-->\
                                <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>3</CODE><SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><ITEM><ITEMID></ITEMID><BC>' + barcode + '</BC><CRDT>' + date + '</CRDT><DST></DST><DELIV></DELIV><USR>' + USR + '</USR><MOKED>' + MOKED + '</MOKED><TYP>0</TYP><ACT>3</ACT><MEM></MEM><DEVKEY>9999</DEVKEY><FN></FN><LN></LN><SIG></SIG><PH1></PH1><PH2></PH2><PH3></PH3><MEM></MEM><RQ></RQ><RQP></RQP><RQW></RQW><ORG></ORG><CRT></CRT><PLT></PLT><LNK></LNK></ITEM><BATCH></BATCH></DATA></MSG></DATA>]]></tem:xml>\
                            </tem:'+ XMLMETHOD + '>\
                        </soapenv:Body>\
                   </soapenv:Envelope>';
        return xml;
    }

    this.send21assignment = function (taskId, isReject, isNoDo, BCS, BC) {
        return $http({
            url: serverUrl,
            method: 'POST',
            data: self.create21assignmentXml(taskId, isReject, isNoDo, BCS, BC),
            headers: {
                "SOAPAction": SoapActionQA,
                "Content-Type": 'application/xml',
                "Accept": "application/xml, text/xml, */*"
            }
        })
    }

    this.create21assignmentXml = function (taskId, isReject, isNoDo, BCS,BC) {
        var date = getCurrentDate();
        var stat = "", reason = "";
        if (isReject != '') {
            stat = 10;
            reason = isReject;
        } else if (isNoDo != '') {
            stat = 6;
            reason = isNoDo;
        } else {
            stat = 6;
            reason = 1;
        }

        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                <soapenv:Header/>\
                    <soapenv:Body>\
                        <tem:' + XMLMETHOD + '>\
                        <!--Optional:-->\
                            <tem:xml>\
                                <![CDATA[\
                                <DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>21</CODE>\
                                <SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY> <DEVKEY>9999</DEVKEY><VER>4</VER></HEADER>\
							    <DATA>\
                                    <STATUS>\
								        <TASKID>' + taskId + '</TASKID>\
										<DT>'+ date + '</DT>\
										<STAT>'+ stat + '</STAT>\
										<REASON>'+ reason + '</REASON>\
										<BC>'+ BC + '</BC>\
                                        <BCS>'+ BCS + '</BCS>\
								    </STATUS>\
								</DATA></MSG></DATA>]]>\
                         </tem:xml>\
                       </tem:' + XMLMETHOD + '>\
                </soapenv:Body>\
            </soapenv:Envelope>';
        return xml;
    }

    this.send3 = function (xml) {
        return $http({
            url: serverUrl,
            method: 'POST',
            data: xml,
            headers: {
                "SOAPAction": SoapActionQA,
                "Content-Type": 'application/xml',
                "Accept": "application/xml, text/xml, */*"
            }
        })
    }

    this.create3 = function (BC, kodMesira, MEM, manui, PH, PH1, PH2, PH3, RQP, RQW, ORG, sig, isPalet, fixedWeight, buffer) {
        BC = BC.toUpperCase();
        var date = getCurrentDate();

        if (!fixedWeight) fixedWeight = '';
        if (PH1 != '' || PH2 != '' || PH3 != '') {
            RQP = "1";
        }
        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
        <soapenv:Header/>\
        <soapenv:Body>\
        <tem:'+ XMLMETHOD + '>\
        <!--Optional:-->\
        <tem:xml><![CDATA[\
        <DATA>\
        <MSG><SYSTEMID>1</SYSTEMID>\
        <HEADER>\
        <MSGVER>1</MSGVER>\
        <CODE>3</CODE>\
        <SENDTIME>'+ date + '</SENDTIME>\
        <GPS/>\
        <USRKEY>'+ USRKEY + '</USRKEY>\
        <DEVKEY>9999</DEVKEY>\
        <VER>2</VER>\
        </HEADER>\
        <DATA>\
        <ITEM>\
        <ITEMID></ITEMID>\
        <BC>' + BC + '</BC>\
        <CRDT>'+ date + '</CRDT>\
        <DST>0</DST>\
        <DELIV>' + kodMesira + '</DELIV>\
        <USR>'+ USR + '</USR>\
        <MOKED>'+ MOKED + '</MOKED>\
        <ACT>9</ACT>\
        <MEM>' + MEM + '</MEM>\
        <BUFFER>' + buffer + '</BUFFER>\
        <MEMP>' + manui + '</MEMP>\
        <DEVKEY>9999</DEVKEY>\
        <FN>'+ firstName + '</FN>\
        <LN>'+ lastName + '</LN>\
        <TYP>0</TYP>\
        <DST></DST>\
        <SIG>'+ sig + '</SIG>\
        <PH>' + PH + '</PH>\
        <PH2>' + PH2 + '</PH2>\
        <PH1>' + PH1 + '</PH1>\
        <PH3>' + PH3 + '</PH3>\
        <RQP>' + RQP + '</RQP>\
        <RQW>' + RQW + '</RQW>\
        <ORG>' + ORG + ' </ORG>\
        <CRT>' + fixedWeight + '</CRT>\
        <PLT>'+ isPalet + '</PLT>\
        </ITEM>\
        <BATCH></BATCH>\
        </DATA>\
        </MSG>\
        </DATA>]]>\
        </tem:xml>\
        </tem:'+ XMLMETHOD + '>\
        </soapenv:Body>\
        </soapenv:Envelope>';

        return xml;
    }

    this.getReport = function () {
        return $http({
            url: serverUrl,
            method: 'POST',
            data: self.getReportXml(),
            headers: {
                "SOAPAction": SoapActionQA,
                "Content-Type": 'application/xml',
                "Accept": "application/xml, text/xml, */*"
            }
        }).then(function (response) {
            return response;
        })
    }

    this.getReportXml = function () {
        var date = getCurrentDate();
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
                                    <LOCK>0</LOCK>\
                                    <MOKED>' + MOKED + '</MOKED>\
								</DATA></MSG></DATA>]]>\
                         </tem:xml>\
                       </tem:' + XMLMETHOD + '>\
                </soapenv:Body>\
            </soapenv:Envelope>';
        return xml;
    }

    this.setManuim = function () {
        $http({
            url: serverUrl,
            method: 'POST',
            data: CreateManuimXML(),
            async:true,
            headers: {
                "SOAPAction": SoapActionQA,
                "Content-Type": 'application/xml',
                "Accept": "application/xml, text/xml, */*"
            }
        }).then(function (data) {
            self.manuim = $.xml2json($.xml2json(data.data)['s:Envelope']['s:Body'][XMLMETHOD+"Response"][XMLMETHOD+"Result"]["DataObject"].Data).DATA.MSG.DATA.NewDataSet.Table;
            getSubscriberName.misparim = self.manuim;
            console.log("manuim loaded");
            $(".circle-wrapper").hide();
        })
    }

    this.containsNumber = function (obj,val) {
        for (var i = 0; i < obj.length; i++) {
            if (obj[i].MemberNumber == val) {
                return true
            }
        }

        return false;
    }

    function CreateManuimXML() {
        var date = getCurrentDate();
        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
                    <soapenv:Header/>\
                    <soapenv:Body>\
                     <tem:'+ XMLMETHOD + '>\
                    <!--Optional:-->\
                    <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>13</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><TBL><TBLID>3</TBLID><TBLDATA>1</TBLDATA><TBLSTR>1</TBLSTR></TBL></DATA></MSG></DATA>]]></tem:xml>\
                    </tem:'+ XMLMETHOD + '>\
                    </soapenv:Body>\
                    </soapenv:Envelope>';
        return xml;
    }

    this.getKodMesiraTable = function () {
        var date = getCurrentDate();
        var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
        <soapenv:Header/>\
           <soapenv:Body>\
              <tem:'+ XMLMETHOD + '>\
                 <!--Optional:-->\
                 <tem:xml><![CDATA[<DATA><MSG><SYSTEMID>1</SYSTEMID><HEADER><MSGVER>1</MSGVER><CODE>13</CODE><SENDTIME>'+ date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>2</VER></HEADER><DATA><TBL><TBLID>1</TBLID><TBLDATA>1</TBLDATA><TBLSTR>1</TBLSTR></TBL></DATA></MSG></DATA>]]></tem:xml>\
                </tem:'+ XMLMETHOD + '>\
           </soapenv:Body>\
        </soapenv:Envelope>';

        //return $http({
        //    url: serverUrl,
        //    method: 'POST',
        //    data: xml,
        //    headers: {
        //        "SOAPAction": SoapActionQA,
        //        "Content-Type": 'application/xml',
        //        "Accept": "application/xml, text/xml, */*"
        //    }

        //})

        $.ajax({
            url: serverUrl,
            dataType: "xml",
            type: "POST",
            async: true,
            contentType: "text/xml;charset=utf-8",
            headers: {
                "SOAPAction": SoapActionQA
            },
            crossDomain: true,
            data: xml,
            timeout: 30000 //30 seconds timeout
        }).done(function (data) {
            var table = $.xml2json($.xml2json(data)['#document']['s:Envelope']['s:Body'][XMLMETHOD + 'Response'][XMLMETHOD + 'Result']['DataObject'].Data)['DATA']['MSG']['DATA']['NewDataSet']['Table']
            localStorage.setItem('kodMesiraTable', JSON.stringify(table))
        }).fail(function (jqXHR, textStatus, thrownError) {
            console.log('error in get kod mesira table')
        });
    }
})