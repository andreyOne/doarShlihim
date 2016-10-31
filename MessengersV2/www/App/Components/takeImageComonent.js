scotchApp.component('takeImageComponent', {
    bindings: {
        img:"<"
    },
    templateUrl: '../www/App/Views/takeImagePage.html',
    controller: function (mainService, $scope) {
        console.log(this.img);
        $('#headerText').text('צילומים בתהליך offline');
        this.table8 = [{
            PhotoRequestDesc: "תעודת משלוח",
            photoRequestCode: "0"
        }]
        this.newTable8 = [];

        this.createNewTable = function (element) {
            this.newTable8.push(element);
            if (this.newTable8.length === 1) {
                this.table8 = this.table8.concat(mainService.table8Obj);
                $scope.$digest();
            }
        }

        this.send = function () {
            if (this.newTable8.length === 0) {
                navigator.notification.alert('חובה לצלם תעודת משלוח');
            } else {
                if (localStorage.newTable8 === undefined) {
                    localStorage.setItem('newTable8', JSON.stringify([this.newTable8]));
                    location.href = '#/mesira_bdika'
                } else {
                    var tb = JSON.parse(localStorage.newTable8)
                    tb.push(this.newTable8)
                    localStorage.setItem('newTable8', JSON.stringify(tb));
                    location.href = '#/mesira_bdika'
                }
            }            
        }
    }
})

scotchApp.component('takePicture', {
    bindings: {
        add: '&',
        picture: '='
    },
    template: "<div class='take_picture' ng-click='$ctrl.capture()'></div>",
    controller: function () {
        this.capture = function () {
            var self = this;
            navigator.camera.getPicture(onCameraSuccess, onCameraFail,
               {
                   quality: 30,
                   sourceType: Camera.PictureSourceType.CAMERA,
                   destinationType: Camera.DestinationType.DATA_URL,
                   encodingType: Camera.EncodingType.JPEG,
                   correctOrientation: true,
                   saveToPhotoAlbum: false,
                   targetWidth: 1500,
                   targetHeight: 1500
               });

            function onCameraSuccess(imageData) {
                self.add({ img: imageData })
            }
            function onCameraFail(message) {

            }
        }
    }
})

scotchApp.component('picBox', {
    bindings: {
        element: '<',
        add: '&'
    },
    templateUrl: '../www/App/Views/picBox.html',
    controller: function ($scope) {
        this.picture = '';
        this.isActive = false;

        this.zoomImage = function () {
            if (this.picture !== '') { this.isActive = !this.isActive }
        }

        this.addPic = function (img) {
            this.picture = 'data:image/png;base64,' + img;
            this.element.img = this.picture;
            this.add({ el: this.element });
            $scope.$digest();
        }
    }
})