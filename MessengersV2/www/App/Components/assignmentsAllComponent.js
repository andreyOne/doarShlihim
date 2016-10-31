scotchApp.component('assignmentsAllComponent',{
    templateUrl: 'App/Views/assignmentsAll.html',
    controller: function ($scope, $routeParams, mainService) {
        this.takenAssignments = [];
        this.laggedTime = localStorage.TASK_LAGGED_TIME;
        this.closedTime = localStorage.TASK_CLOSED2EXECUTION_TIME;

        var self = this;

        angular.element(document.getElementById("headerText")).html("משימות")

        //$(".mainContent").css("height", window.innerHeight - ($("#header").innerHeight() + 170));
        $(".circle-wrapper").show();
        mainService.getAssigments().then(function (result) {
            $(".circle-wrapper").hide();
            self.takenAssignments = result.takenAssignments;
            if (self.takenAssignments.length == 0) {
                location.href = "#/assignments_empty";
            }
        }, function (err) {
            navigator.notification.alert('אין תקשורת, נסה שנית');
            $(".circle-wrapper").hide();
        })

        this.toAssignment = function (assignment) {
            mainService.currentAssignment = assignment;           
            if (assignment.Type == 2) {
                location.href = "#/mesimat_Mesira_Shlav_Rishon"
            } else {
                location.href = "#/assignments_collect";
            }       
        }

        this.getColor = function (from, to) {
            var color = "green";
            var current = new Date().getTime();
            var f = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), from.split(':')[0], (+from.split(':')[1]) - +self.laggedTime).getTime();
            var t = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), to.split(':')[0], (+to.split(':')[1]) + +self.closedTime).getTime();

            if (current > f) {color = "orange";}
            if (current > t) {color = "red";}

            return color;
        }

    }

    //    angular.element(document).ready(function () {

    //        var stat4TasksArrayIndex = 0;
    //        var stat4TasksArray = [];

    //        var xml = CreateXml();
    //        $.ajax({
    //            url: serverUrl,
    //            dataType: "xml",
    //            //dataType: 'json',
    //            type: "POST",
    //            async: false,
    //            contentType: "text/xml;charset=utf-8",
    //            headers: {
    //                "SOAPAction": SoapActionQA
    //            },
    //            crossDomain: true,
    //            data: xml,
    //            timeout: 30000 //30 seconds timeout
    //        }).done(function (data) {
    //            var responseXML = $.xml2json(data)['#document']['s:Envelope']['s:Body'][XMLMETHOD + 'Response'][XMLMETHOD + 'Result']['DataObject'].Data
    //            if (responseXML == null || responseXML == '') {
    //                location.href = "#/assignments_empty";
    //            } else {
    //                var json = $.xml2json(responseXML)['DATA']['MSG']['DATA']['TASKS'];
    //                //if (json.DATA.MSG.HEADER.CODE == 20) {
    //                createTasks(json);
    //            }
    //        }).fail(function (jqXHR, textStatus, thrownError) {
    //            navigator.notification.alert('אין תקשורת, נסה שנית');
    //        });

    //        function createTasks(tasksObject) {
    //            var tasks = $.makeArray(tasksObject.TASK);
    //            if (tasks.length == 0) {
    //                location.href = "#/assignments_empty";
    //            } else {
    //                for (var i = 0; i < tasks.length; i++) {
    //                    if (tasks[i].STAT == 4) {
    //                        stat4TasksArray[stat4TasksArrayIndex] = [];
    //                        stat4TasksArray[stat4TasksArrayIndex]["taskType"] = tasks[i].Type;
    //                        stat4TasksArray[stat4TasksArrayIndex]["taskId"] = tasks[i].taskID.toString();
    //                        stat4TasksArray[stat4TasksArrayIndex]["contactName"] = tasks[i].new_contact_in_address;
    //                        stat4TasksArray[stat4TasksArrayIndex]["city"] = tasks[i].new_cityid;
    //                        stat4TasksArray[stat4TasksArrayIndex]["street"] = tasks[i].new_street;
    //                        stat4TasksArray[stat4TasksArrayIndex]["houseNumber"] = tasks[i].new_house_number;
    //                        if (tasks[i].Type == 1 || tasks[i].Type == 3) { //isuf
    //                            stat4TasksArray[stat4TasksArrayIndex]["contractId"] = tasks[i].new_contractid;
    //                            stat4TasksArray[stat4TasksArrayIndex]["contactPhoneNumber"] = tasks[i].new_contact_main_phone;
    //                            stat4TasksArray[stat4TasksArrayIndex]["fromHour"] = tasks[i].new_collection_from_hour;
    //                            stat4TasksArray[stat4TasksArrayIndex]["collect_floor"] = tasks[i].new_collect_floor;
    //                            stat4TasksArray[stat4TasksArrayIndex]["collect_remarks"] = tasks[i].new_collect_remarks;

    //                            //stat4TasksArray[stat4TasksArrayIndex]["collect_remarks"] = 'andrey andrey andrey andrey andrey andrey andrey andrey andrey andrey andrey andrey andrey andrey andrey andrey '

    //                            stat4TasksArray[stat4TasksArrayIndex]["toHour"] = tasks[i].new_collection_to_hour;

    //                            if ((tasks[i].new_collection_from_hour == "" || typeof (tasks[i].new_collection_from_hour) == 'object') && (tasks[i].new_collection_to_hour == "" || typeof (tasks[i].new_collection_to_hour) == 'object')) {
    //                                stat4TasksArray[stat4TasksArrayIndex]["fromHour"] = "23:01";
    //                                stat4TasksArray[stat4TasksArrayIndex]["toHour"] = "23:59";
    //                            }

    //                            if (!(tasks[i].new_collection_from_hour == "" || typeof (tasks[i].new_collection_from_hour) == 'object') && (tasks[i].new_collection_to_hour == "" || typeof (tasks[i].new_collection_to_hour) == 'object')) {
    //                                stat4TasksArray[stat4TasksArrayIndex]["toHour"] = "20:00";
    //                            }

    //                            if ((tasks[i].new_collection_from_hour == "" || typeof (tasks[i].new_collection_from_hour) == 'object') && !(tasks[i].new_collection_to_hour == "" || typeof (tasks[i].new_collection_to_hour) == 'object')) {
    //                                stat4TasksArray[stat4TasksArrayIndex]["fromHour"] = "07:59";
    //                            }

    //                            stat4TasksArray[stat4TasksArrayIndex]["newCaseNumber"] = tasks[i].new_case_number;
    //                        }
    //                        else if (tasks[i].Type == 2)// mesira
    //                        {
    //                            stat4TasksArray[stat4TasksArrayIndex]["contractId"] = tasks[i].new_account_number;
    //                            stat4TasksArray[stat4TasksArrayIndex]["contactPhoneNumber"] = tasks[i].new_primary_telephone2;
    //                            stat4TasksArray[stat4TasksArrayIndex]["fromHour"] = tasks[i].new_delivery_from_hour;
    //                            stat4TasksArray[stat4TasksArrayIndex]["enterance"] = tasks[i].new_enterance;
    //                            stat4TasksArray[stat4TasksArrayIndex]["floor"] = tasks[i].new_ms_floor;
    //                            stat4TasksArray[stat4TasksArrayIndex]["apartment_number"] = tasks[i].new_apartment_number;
    //                            stat4TasksArray[stat4TasksArrayIndex]["comments"] = tasks[i].new_comments;

    //                            //stat4TasksArray[stat4TasksArrayIndex]["comments"] = 'andrey andrey andrey andrey andrey andrey andrey andrey andrey andrey andrey andrey andrey andrey andrey andrey '

    //                            stat4TasksArray[stat4TasksArrayIndex]["toHour"] = tasks[i].new_delivery_until_hour;

    //                            if ((tasks[i].new_delivery_from_hour == "" || typeof (tasks[i].new_delivery_from_hour) == 'object') && (tasks[i].new_delivery_until_hour == "" || typeof (tasks[i].new_delivery_until_hour) == 'object')) {
    //                                stat4TasksArray[stat4TasksArrayIndex]["fromHour"] = "23:01";
    //                                stat4TasksArray[stat4TasksArrayIndex]["toHour"] = "23:59";
    //                            }

    //                            if (!(tasks[i].new_delivery_from_hour == "" || typeof (tasks[i].new_delivery_from_hour) == 'object') && (tasks[i].new_delivery_until_hour == "" || typeof (tasks[i].new_delivery_until_hour) == 'object')) {
    //                                stat4TasksArray[stat4TasksArrayIndex]["toHour"] = "20:00";
    //                            }

    //                            if ((tasks[i].new_delivery_from_hour == "" || typeof (tasks[i].new_delivery_from_hour) == 'object') && !(tasks[i].new_delivery_until_hour == "" || typeof (tasks[i].new_delivery_until_hour) == 'object')) {
    //                                stat4TasksArray[stat4TasksArrayIndex]["fromHour"] = "07:59";
    //                            }

    //                            stat4TasksArray[stat4TasksArrayIndex]["new_barkod"] = tasks[i].new_barkod;
    //                        }
    //                        stat4TasksArrayIndex++;
    //                    }
    //                }
    //            }
    //        }

    //        if (stat4TasksArray.length == 0) {
    //            location.href = "#/assignments_empty";
    //        }

    //        console.log('There are total ' + stat4TasksArray.length + ' tasks to display');
    //        //sort the tasks according to the required logic        
    //        var tasksInDelay = [];
    //        var tasksInDelayIndex = 0;
    //        var tasksCloseToDo = [];
    //        var tasksCloseToDoIndex = 0;
    //        var regularTasks = [];
    //        var regularTasksIndex = 0;

    //        var currentTime = new Date();

    //        for (var i = 0; i < stat4TasksArray.length; i++) {
    //            var taskTotime = createDate(stat4TasksArray[i].toHour.substring(0, 2), stat4TasksArray[i].toHour.substring(3, 5));
    //            var taskFromTime = createDate(stat4TasksArray[i].fromHour.substring(0, 2), stat4TasksArray[i].fromHour.substring(3, 5));
    //            var diffInMinutesToTime = getMinutesBetweenDates(currentTime, taskTotime);
    //            if (diffInMinutesToTime < 0) {
    //                tasksInDelay[tasksInDelayIndex] = [];

    //                tasksInDelay[tasksInDelayIndex]["taskType"] = stat4TasksArray[i].taskType;
    //                tasksInDelay[tasksInDelayIndex]["contractId"] = stat4TasksArray[i].contractId;
    //                tasksInDelay[tasksInDelayIndex]["contactName"] = stat4TasksArray[i].contactName;
    //                tasksInDelay[tasksInDelayIndex]["contactPhoneNumber"] = stat4TasksArray[i].contactPhoneNumber;
    //                tasksInDelay[tasksInDelayIndex]["fromHour"] = stat4TasksArray[i].fromHour;
    //                tasksInDelay[tasksInDelayIndex]["toHour"] = stat4TasksArray[i].toHour;
    //                tasksInDelay[tasksInDelayIndex]["city"] = stat4TasksArray[i].city;
    //                tasksInDelay[tasksInDelayIndex]["street"] = stat4TasksArray[i].street;
    //                tasksInDelay[tasksInDelayIndex]["houseNumber"] = stat4TasksArray[i].houseNumber;
    //                tasksInDelay[tasksInDelayIndex]["taskId"] = stat4TasksArray[i].taskId;
    //                tasksInDelay[tasksInDelayIndex]["newCaseNumber"] = stat4TasksArray[i].newCaseNumber;
    //                tasksInDelay[tasksInDelayIndex]["diffTime"] = Math.abs(diffInMinutesToTime);


    //                if (stat4TasksArray[i].taskType == 2) {
    //                    tasksInDelay[tasksInDelayIndex]["new_barkod"] = stat4TasksArray[i].new_barkod;
    //                    tasksInDelay[tasksInDelayIndex]["floor"] = stat4TasksArray[i].floor;
    //                    tasksInDelay[tasksInDelayIndex]["comments"] = stat4TasksArray[i].comments;
    //                    tasksInDelay[tasksInDelayIndex]["apartment_number"] = stat4TasksArray[i].apartment_number;
    //                    tasksInDelay[tasksInDelayIndex]["enterance"] = stat4TasksArray[i].enterance;
    //                } else {
    //                    tasksInDelay[tasksInDelayIndex]["collect_floor"] = stat4TasksArray[i].collect_floor;
    //                    tasksInDelay[tasksInDelayIndex]["floor"] = stat4TasksArray[i].floor;
    //                    tasksInDelay[tasksInDelayIndex]["collect_remarks"] = stat4TasksArray[i].collect_remarks;
    //                }

    //                tasksInDelayIndex++;
    //            } else {
    //                var diffInMinutesFromTime = getMinutesBetweenDates(currentTime, taskFromTime);
    //                if (diffInMinutesFromTime < localStorage.getItem("TASK_CLOSED2EXECUTION_TIME")) {
    //                    tasksCloseToDo[tasksCloseToDoIndex] = [];

    //                    tasksCloseToDo[tasksCloseToDoIndex]["taskType"] = stat4TasksArray[i].taskType;
    //                    tasksCloseToDo[tasksCloseToDoIndex]["contractId"] = stat4TasksArray[i].contractId;
    //                    tasksCloseToDo[tasksCloseToDoIndex]["contactName"] = stat4TasksArray[i].contactName;
    //                    tasksCloseToDo[tasksCloseToDoIndex]["contactPhoneNumber"] = stat4TasksArray[i].contactPhoneNumber;
    //                    tasksCloseToDo[tasksCloseToDoIndex]["fromHour"] = stat4TasksArray[i].fromHour;
    //                    tasksCloseToDo[tasksCloseToDoIndex]["toHour"] = stat4TasksArray[i].toHour;
    //                    tasksCloseToDo[tasksCloseToDoIndex]["city"] = stat4TasksArray[i].city;
    //                    tasksCloseToDo[tasksCloseToDoIndex]["street"] = stat4TasksArray[i].street;
    //                    tasksCloseToDo[tasksCloseToDoIndex]["houseNumber"] = stat4TasksArray[i].houseNumber;
    //                    tasksCloseToDo[tasksCloseToDoIndex]["taskId"] = stat4TasksArray[i].taskId;
    //                    tasksCloseToDo[tasksCloseToDoIndex]["newCaseNumber"] = stat4TasksArray[i].newCaseNumber;

    //                    if (stat4TasksArray[i].taskType == 2) {
    //                        tasksCloseToDo[tasksCloseToDoIndex]["new_barkod"] = stat4TasksArray[i].new_barkod;
    //                        tasksCloseToDo[tasksCloseToDoIndex]["comments"] = stat4TasksArray[i].comments;
    //                        tasksCloseToDo[tasksCloseToDoIndex]["floor"] = stat4TasksArray[i].floor;
    //                        tasksCloseToDo[tasksCloseToDoIndex]["apartment_number"] = stat4TasksArray[i].apartment_number;
    //                        tasksCloseToDo[tasksCloseToDoIndex]["enterance"] = stat4TasksArray[i].enterance;

    //                    } else {
    //                        tasksCloseToDo[tasksCloseToDoIndex]["collect_floor"] = stat4TasksArray[i].collect_floor;
    //                        tasksCloseToDo[tasksCloseToDoIndex]["collect_remarks"] = stat4TasksArray[i].collect_remarks;
    //                    }
    //                    if (diffInMinutesToTime < 0) {
    //                        diffInMinutesToTime = diffInMinutesToTime * (-1);
    //                    }
    //                    tasksCloseToDo[tasksCloseToDoIndex].diffTime = diffInMinutesToTime;

    //                    tasksCloseToDoIndex++;
    //                } else {
    //                    regularTasks[regularTasksIndex] = [];

    //                    regularTasks[regularTasksIndex]["taskType"] = stat4TasksArray[i].taskType;
    //                    regularTasks[regularTasksIndex]["contractId"] = stat4TasksArray[i].contractId;
    //                    regularTasks[regularTasksIndex]["contactName"] = stat4TasksArray[i].contactName;
    //                    regularTasks[regularTasksIndex]["contactPhoneNumber"] = stat4TasksArray[i].contactPhoneNumber;
    //                    regularTasks[regularTasksIndex]["fromHour"] = stat4TasksArray[i].fromHour;
    //                    regularTasks[regularTasksIndex]["toHour"] = stat4TasksArray[i].toHour;
    //                    regularTasks[regularTasksIndex]["city"] = stat4TasksArray[i].city;
    //                    regularTasks[regularTasksIndex]["street"] = stat4TasksArray[i].street;
    //                    regularTasks[regularTasksIndex]["houseNumber"] = stat4TasksArray[i].houseNumber;
    //                    regularTasks[regularTasksIndex]["taskId"] = stat4TasksArray[i].taskId;
    //                    regularTasks[regularTasksIndex]["newCaseNumber"] = stat4TasksArray[i].newCaseNumber;


    //                    if (stat4TasksArray[i].taskType == 2) {
    //                        regularTasks[regularTasksIndex]["new_barkod"] = stat4TasksArray[i].new_barkod;
    //                        regularTasks[regularTasksIndex]["comments"] = stat4TasksArray[i].comments;
    //                        regularTasks[regularTasksIndex]["apartment_number"] = stat4TasksArray[i].apartment_number;
    //                        regularTasks[regularTasksIndex]["floor"] = stat4TasksArray[i].floor;
    //                        regularTasks[regularTasksIndex]["enterance"] = stat4TasksArray[i].enterance;
    //                    } else {
    //                        regularTasks[regularTasksIndex]["collect_floor"] = stat4TasksArray[i].collect_floor;
    //                        regularTasks[regularTasksIndex]["collect_remarks"] = stat4TasksArray[i].collect_remarks
    //                    }
    //                    regularTasksIndex++;
    //                }
    //            }
    //        }

    //        //sort tasksInDelay and takskCloseToDo according to diff time (no need to sort regularTasks)        
    //        if (tasksInDelay.length > 0) {
    //            tasksInDelay.sort(function (a, b) { return b.diffTime - a.diffTime; })
    //        }
    //        if (tasksCloseToDo.length > 0) {
    //            tasksCloseToDo.sort(function (a, b) { return b.diffTime - a.diffTime; })
    //        }

    //        //loop over the tasks and add them to the screen (all the tasks have stat 4)                       
    //        for (var i = 0; i < tasksInDelay.length; i++) {
    //            var taskTypeClass;
    //            if (tasksInDelay[i].taskType == 1 || tasksInDelay[i].taskType == 3) {
    //                taskTypeClass = 'collect';
    //            } else {
    //                taskTypeClass = 'deliver';
    //            }
    //            var classRedColor = "";
    //            if ((tasksInDelay[i].diffTime > localStorage.getItem("TASK_LAGGED_TIME"))) {
    //                classRedColor = "red";
    //            }
    //            var htmltasksInDelay = '';
    //            htmltasksInDelay += '<li><div class="assign_innerTableRight"><div class="' + classRedColor + ' ' + taskTypeClass + '">' + tasksInDelay[i].fromHour + ' - ' + tasksInDelay[i].toHour + '</div></div>';
    //            htmltasksInDelay += '<div class="assign_innrtTableLeft"><strong>' + tasksInDelay[i].city + '</strong><br>' + tasksInDelay[i].street + ' ' + tasksInDelay[i].houseNumber + '</div>';
    //            htmltasksInDelay += '<div class="assign_innerTableLeft2 ClickInDelay"><a id="assignAddInDelay_' + i + '"><img src="images/assignAdd.jpg" alt=""/></a></div></li>';

    //            $("#tasksList").append(htmltasksInDelay);
    //        }

    //        console.log('There are ' + tasksInDelay.length + ' tasks in delay');

    //        for (var i = 0; i < tasksCloseToDo.length; i++) {
    //            var taskTypeClass;
    //            if (tasksCloseToDo[i].taskType == 1 || tasksCloseToDo[i].taskType == 3) {
    //                taskTypeClass = 'collect';
    //            } else {
    //                taskTypeClass = 'deliver';
    //            }

    //            var htmltasksCloseToDo = '';
    //            htmltasksCloseToDo += '<li><div class="assign_innerTableRight"><div class="orange ' + taskTypeClass + '">' + tasksCloseToDo[i].fromHour + ' - ' + tasksCloseToDo[i].toHour + '</div></div>';
    //            htmltasksCloseToDo += '<div class="assign_innrtTableLeft"><strong>' + tasksCloseToDo[i].city + '</strong><br>' + tasksCloseToDo[i].street + ' ' + tasksCloseToDo[i].houseNumber + '</div>';
    //            htmltasksCloseToDo += '<div class="assign_innerTableLeft2 ClickCloseToDo"><a id="assignAddCloseToDo_' + i + '"><img src="images/assignAdd.jpg" alt=""/></a></div></li>';

    //            $("#tasksList").append(htmltasksCloseToDo);
    //        }

    //        console.log('There are ' + tasksCloseToDo.length + ' tasks close to do');

    //        for (var i = 0; i < regularTasks.length; i++) {
    //            var taskTypeClass;
    //            if (regularTasks[i].taskType == 1 || regularTasks[i].taskType == 3) {
    //                taskTypeClass = 'collect';
    //            } else {
    //                taskTypeClass = 'deliver';
    //            }

    //            var htmlregularTasks = '';
    //            htmlregularTasks += '<li><div class="assign_innerTableRight"><div class="green ' + taskTypeClass + '">' + regularTasks[i].fromHour + ' - ' + regularTasks[i].toHour + '</div></div>';
    //            htmlregularTasks += '<div class="assign_innrtTableLeft"><strong>' + regularTasks[i].city + '</strong><br>' + regularTasks[i].street + ' ' + regularTasks[i].houseNumber + '</div>';
    //            htmlregularTasks += '<div class="assign_innerTableLeft2 ClickRegular"><a id="assignAddregularTasks_' + i + '"><img src="images/assignAdd.jpg" alt=""/></a></div></li>';

    //            $("#tasksList").append(htmlregularTasks);
    //        }

    //        console.log('There are ' + regularTasks.length + ' regular tasks');
    //        console.log('done building task for assignmentsAll');
    //        $(".mainContent").css("height", window.innerHeight - ($("#header").innerHeight() + 170));


    //        //bind clicks on + signs
    //        $('.ClickInDelay').on('click', function () {
    //            var index = ($(this).find('a')[0].getAttribute('id')).slice(-1);
    //            console.log('index= ' + index);
    //            if (tasksInDelay[index].taskType == 1 || tasksInDelay[index].taskType == 3) {
    //                toAssignments_collect(tasksInDelay[index].taskId.toString(), tasksInDelay[index].contractId, tasksInDelay[index].contactName, tasksInDelay[index].contactPhoneNumber, tasksInDelay[index].fromHour, tasksInDelay[index].toHour, tasksInDelay[index].city, tasksInDelay[index].street, tasksInDelay[index].houseNumber, tasksInDelay[index].newCaseNumber, tasksInDelay[index].floor, tasksInDelay[index].collect_remarks);
    //            } else if (tasksInDelay[index].taskType == 2) {
    //                toAssignments_deliver(tasksInDelay[index].taskId.toString(), tasksInDelay[index].contractId, tasksInDelay[index].contactName, tasksInDelay[index].contactPhoneNumber, tasksInDelay[index].fromHour, tasksInDelay[index].toHour, tasksInDelay[index].city, tasksInDelay[index].street, tasksInDelay[index].houseNumber, tasksInDelay[index].newCaseNumber, tasksInDelay[index].new_barkod);
    //            }
    //        });

    //        $('.ClickCloseToDo').on('click', function () {
    //            var index = ($(this).find('a')[0].getAttribute('id')).slice(-1);
    //            console.log('index= ' + index);
    //            if (tasksCloseToDo[index].taskType == 1 || tasksCloseToDo[index].taskType == 3) {
    //                toAssignments_collect(tasksCloseToDo[index].taskId.toString(), tasksCloseToDo[index].contractId, tasksCloseToDo[index].contactName, tasksCloseToDo[index].contactPhoneNumber, tasksCloseToDo[index].fromHour, tasksCloseToDo[index].toHour, tasksCloseToDo[index].city, tasksCloseToDo[index].street, tasksCloseToDo[index].houseNumber, tasksCloseToDo[index].newCaseNumber, tasksCloseToDo[index].collect_floor, tasksCloseToDo[index].collect_remarks);
    //            } else if (tasksCloseToDo[index].taskType == 2) {
    //                toAssignments_deliver(tasksCloseToDo[index].taskId.toString(), tasksCloseToDo[index].contractId, tasksCloseToDo[index].contactName, tasksCloseToDo[index].contactPhoneNumber, tasksCloseToDo[index].fromHour, tasksCloseToDo[index].toHour, tasksCloseToDo[index].city, tasksCloseToDo[index].street, tasksCloseToDo[index].houseNumber, tasksCloseToDo[index].newCaseNumber, tasksCloseToDo[index].new_barkod, tasksCloseToDo[index].enterance, tasksCloseToDo[index].floor, tasksCloseToDo[index].apartment_number, tasksCloseToDo[index].comments);
    //            }
    //        });

    //        $('.ClickRegular').on('click', function () {

    //            var index = ($(this).find('a')[0].getAttribute('id')).slice(-1);
    //            console.log('index= ' + index);
    //            if (regularTasks[index].taskType == 1 || regularTasks[index].taskType == 3) {
    //                toAssignments_collect(regularTasks[index].taskId.toString(), regularTasks[index].contractId, regularTasks[index].contactName, regularTasks[index].contactPhoneNumber, regularTasks[index].fromHour, regularTasks[index].toHour, regularTasks[index].city, regularTasks[index].street, regularTasks[index].houseNumber, regularTasks[index].newCaseNumber, regularTasks[index].collect_floor, regularTasks[index].collect_remarks);
    //            } else if (regularTasks[index].taskType == 2) {
    //                toAssignments_deliver(regularTasks[index].taskId.toString(), regularTasks[index].contractId, regularTasks[index].contactName, regularTasks[index].contactPhoneNumber, regularTasks[index].fromHour, regularTasks[index].toHour, regularTasks[index].city, regularTasks[index].street, regularTasks[index].houseNumber, regularTasks[index].newCaseNumber, regularTasks[index].new_barkod, regularTasks[index].enterance, regularTasks[index].floor, regularTasks[index].apartment_number, regularTasks[index].comments);
    //            }
    //        });
    //    });


    //    function toAssignments_collect(taskId, contractId, contactName, contactPhoneNumber, fromHour, toHour, city, street, houseNumber, newCaseNumber, collect_floor, collect_remarks) {

    //        houseNumber = encodeURIComponent(houseNumber.toString())
    //        contactName = encodeURIComponent(contactName.toString())
    //        collect_remarks = encodeURIComponent(collect_remarks.toString())
    //        //console.log('toAssignments_collect ' + taskId + ' ' + contractId + ' ' + contactName + ' ' + contactPhoneNumber + ' ' + fromHour + ' ' + toHour + ' ' + city + ' ' + street + ' ' + houseNumber + ' ' + newCaseNumber);
    //        location.href = "#/assignments_collect/taskId/" + taskId + "/contractId/" + contractId + "/contactName/" + encodeURIComponent(contactName.toString()) + "/contactPhoneNumber/" + encodeURIComponent(contactPhoneNumber.toString()) + "/fromHour/" + fromHour + "/toHour/" + toHour + "/city/" + encodeURIComponent(city.toString()) + "/street/" + encodeURIComponent(street.toString()) + "/houseNumber/" + encodeURIComponent(houseNumber.toString()) + "/newCaseNumber/" + newCaseNumber + "/collect_floor/" + collect_floor + "/collect_remarks/" + encodeURIComponent(collect_remarks.toString());
    //    }

    //    function toAssignments_deliver(taskId, contractId, contactName, contactPhoneNumber, fromHour, toHour, city, street, houseNumber, newCaseNumber, new_barkod, enterance, floor, apartment_number, comments) {

    //        //console.log('toAssignments_deliver ' + taskId + ' ' + contractId + ' ' + contactName + ' ' + contactPhoneNumber + ' ' + fromHour + ' ' + toHour + ' ' + city + ' ' + street + ' ' + houseNumber + ' ' + newCaseNumber + ' ' + new_barkod + ' ' + comments);

    //        if (typeof (taskId) === 'object' || taskId == null || taskId == 'undefined') { taskId = ''; }
    //        if (typeof (contractId) === 'object' || contractId == null || contractId == 'undefined') { contractId = ''; }
    //        if (typeof (contactName) === 'object' || contactName == null || contactName == 'undefined') { contactName = ''; }
    //        if (typeof (contactPhoneNumber) === 'object' || contactPhoneNumber == null || contactPhoneNumber == 'undefined') { contactPhoneNumber = ''; }
    //        if (typeof (fromHour) === 'object' || fromHour == null || fromHour == 'undefined') { fromHour = ''; }
    //        if (typeof (toHour) === 'object' || toHour == null || toHour == 'undefined') { toHour = ''; }
    //        if (typeof (city) === 'object' || city == null || city == 'undefined') { city = '0'; }
    //        if (typeof (street) === 'object' || street == null || street == 'undefined') { street = ''; }
    //        if (typeof (houseNumber) === 'object' || houseNumber == null || houseNumber == 'undefined') { houseNumber = ''; }
    //        if (typeof (newCaseNumber) === 'object' || newCaseNumber == null || newCaseNumber == 'undefined') { newCaseNumber = ''; }
    //        if (typeof (new_barkod) === 'object' || new_barkod == null || new_barkod == 'undefined') { new_barkod = ''; }
    //        if (typeof (enterance) === 'object' || enterance == null || enterance == 'undefined') { enterance = ''; }
    //        if (typeof (floor) === 'object' || floor == null || floor == 'undefined') { floor = ''; }
    //        if (typeof (apartment_number) === 'object' || apartment_number == null || apartment_number == 'undefined') { apartment_number = ''; }
    //        if (typeof (comments) === 'object' || comments == null || comments == 'undefined') { comments = ''; }
    //        MesimatMesiraObject = {
    //            "taskId": taskId, "contractId": contractId, "contactName": contactName,
    //            "contactPhoneNumber": contactPhoneNumber, "fromHour": fromHour, "toHour": toHour,
    //            "city": city, "street": street, "houseNumber": houseNumber, "newCaseNumber": newCaseNumber,
    //            "new_barkod": new_barkod, "enterance": enterance, "floor": floor, "apartment_number": apartment_number, "comments": comments
    //        };

    //        location.href = "#/mesimat_Mesira_Shlav_Rishon";

    //    }



    //    function getMinutesBetweenDates(startDate, endDate) {
    //        var diff = endDate.getTime() - startDate.getTime();
    //        return Math.round(diff / 60000);
    //    }

    //    function createDate(hours, minutes) {
    //        var date = new Date();
    //        var day = date.getDate();
    //        if (day < 10) {
    //            day = "0" + day;
    //        }

    //        var str = new Date(date.getFullYear(), date.getMonth(), day, hours, minutes, 0, 0);
    //        return str;
    //    }

    //    function CreateXml() {
    //        var date = getCurrentDate();
    //        var USR = localStorage.getItem("USR");
    //        var MOKED = localStorage.getItem("MOKED");
    //        var USRKEY = localStorage.getItem("USRKEY");

    //        var xml =
    //            '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">\
    //            <soapenv:Header/>\
    //                <soapenv:Body>\
    //                    <tem:'+ XMLMETHOD + '>\
    //                    <!--Optional:-->\
    //                        <tem:xml>\
    //                            <![CDATA[\
    //                            <DATA><MSG><HEADER><MSGVER>1</MSGVER><CODE>34</CODE>\
    //                            <SENDTIME>' + date + '</SENDTIME><GPS/><USRKEY>' + USRKEY + '</USRKEY><DEVKEY>9999</DEVKEY><VER>4</VER></HEADER>\
    //                                                <DATA><USR>' + USR + '</USR>\
    //                            <MOKED>' + MOKED + '</MOKED>\
    //                                                   </DATA></MSG></DATA>]]>\
    //                     </tem:xml>\
    //                   </tem:'+ XMLMETHOD + '>\
    //            </soapenv:Body>\
    //        </soapenv:Envelope>';
    //        console.log(xml);
    //        return xml;
    //    }
    //}
});
