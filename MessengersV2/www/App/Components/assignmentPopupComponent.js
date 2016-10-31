scotchApp.component('popup', {
    bindings: {
        tasks: "=",
        callFlag:"<"
    },
    templateUrl: '../www/App/Views/popup.html',
    controller: function (mainService) {
        this.statusChoose = "accept";
        this.reason = "";

        var self = this;

        this.removeTask = function (task) {
            this.tasks.splice(this.tasks.indexOf(task), 1);
            if (this.tasks.length == 0) {
                $.magnificPopup.close();
                if (this.callFlag) {
                    location.href = "#/assignments_all";
                }
            }
        }

        this.sendAssignment = function (assignment) {
            $(".circle-wrapper").show();
            if (this.statusChoose == "reject" && this.reason == "") {
                navigator.notification.alert('עליך לבחור סיבת דחייה');
                $(".circle-wrapper").hide();
            } else {
                if (assignment.STAT == 1 || assignment.STAT == 2) {
                    assignment.STAT = 3;
                    mainService.sendAssignment(assignment, "").then(function (result) { });
                }
                assignment.STAT = this.statusChoose == "reject" ? 5 : 4;
                mainService.sendAssignment(assignment, this.reason).then(function (result) {
                    $(".circle-wrapper").hide();
                    this.reason = "";
                    if (result.RESULT != 0) {
                        navigator.notification.alert(result.RESMSG);
                    } else {
                        navigator.notification.alert('דווח בהצלחה');
                        self.removeTask(assignment);
                    }

                    console.log(result);
                })
            }
        }

        this.getSubscriberName = function(mem) {return getSubscriberName(mem).trim()};
    }
})