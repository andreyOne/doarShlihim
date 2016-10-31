scotchApp.service('offlineService', function ($http) {
    setInterval(function () {
        p = JSON.parse(localStorage.getItem('offlineXml'));
        if (Object.keys(p).length != 0) {
            for (var key in p) {
                if (p.hasOwnProperty(key)) {
                    sendOfflineXml(key,p[key]);                    
                }
            }
        }  
    }, 3000)


    function sendOfflineXml(key, xml) {
        $.ajax({
            url: serverUrl,
            dataType: "xml",
            //dataType: 'json',
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
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(data.firstChild.firstChild.firstChild.firstChild.firstChild.children[1].firstChild.nodeValue, "text/xml");
            var result = xmlDoc.firstChild.firstChild.children[1].firstChild.children[1].innerHTML;
            var message = xmlDoc.firstChild.firstChild.children[1].firstChild.children[2].innerHTML;
            if (result == "0" || result == "1") {
                offlineXml = JSON.parse(localStorage.getItem('offlineXml'));
                delete offlineXml[key];
                localStorage.setItem('offlineXml', JSON.stringify(offlineXml));
            }
        })
    }
})