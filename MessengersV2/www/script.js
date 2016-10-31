var scotchApp = angular.module('scotchApp', ['ngRoute', 'ngAutocomplete', 'MassAutoComplete', 'ngSanitize']);
scotchApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/login.html',
            controller: 'loginController'
        })
        .when('/takeImagePage', {
            template: '<take-image-component></take-image-component>'
        })
        .when('/itemsInMemory', {
            template: '<items></items>'
        })
        .when('/sendOfflinePage', {
            template: '<send-offline box="$ctrl.picBox"></send-offline>'
        })
        .when('/showOfflinePage', {
            template: '<show-offline></show-offline>'
        })
        .when('/resetPass', {
            templateUrl: 'pages/resetPass.html',
            controller: 'forgetPassController'
        })
        .when('/assignments_all', {
            template: '<assignments-all-component></assignments-all-component>'
        })
        .when('/assignments_collect', {
            template: '<assignments-collect-component></assignments-collect-component>'
        }).when('/report', {
            template: '<report></report>',
        })
        .when('/takeImage', {
            template: '<take-image-component img="$ctrl.image"></take-image-component>',
        })



     .when('/distribution', {
         templateUrl: 'pages/distribution.html',
         controller: 'distributionController'
     })
     .when('/collect', {
         templateUrl: 'pages/collect.html',
         controller: 'collectController'
     })
     .when('/collect_joined', {
         templateUrl: 'pages/collect_joined.html',
         controller: 'collect_joinedController'
     })
     .when('/mesira_bdika', {
         templateUrl: 'pages/mesira_bdika.html',
         controller: 'deliverController'
     })
          .when('/mesira_takin/originalWeight/:originalWeight/barcode/:barcode/fixedWeight/:fixWeight/kodmesira/:kodmesira/countPictures/:countPictures/isPalet/:isPalet/MEM/:MEM/buffer/:buffer/RQW/:RQW', {
              templateUrl: 'pages/mesira_takin.html',
              controller: 'mesiraTakinController'
          })

        .when('/mesira_merukezet_takin/originalWeight/:originalWeight/barcode/:barcode/fixedWeight/:fixWeight/kodmesira/:kodmesira/countPictures/:countPictures/isPalet/:isPalet/MEM/:MEM', {
            templateUrl: 'pages/mesira_merukezet_takin_2.html',
            controller: 'mesiraMerukezetTakinController'
        })
           .when('/mesira_merukezet_takin/originalWeight/:originalWeight/barcode/:barcode/fixedWeight/:fixWeight/kodmesira/:kodmesira/countPictures/:countPictures/isPalet/:isPalet/MEM/:MEM/From/:From/Count/:Count', {
               templateUrl: 'pages/mesira_merukezet_takin_2.html',
               controller: 'mesiraMerukezetTakinController'
           })


   .when('/deliverJoined', {
       templateUrl: 'pages/mesira_merukezet_takin_2.html',
       controller: 'mesiraMerukezetTakinController'
   })

         .when('/weightNormal/originalWeight/:originalWeight/barcode/:barcode/kodmesira/:kodmesira/countPictures/:countPictures/isPalet/:isPalet/MEM/:MEM', {
             templateUrl: 'pages/weight_control_normal.html',
             controller: 'weightNormalController'
         })

        .when('/weightNormal/originalWeight/:originalWeight/barcode/:barcode/kodmesira/:kodmesira/countPictures/:countPictures/isPalet/:isPalet/MEM/:MEM/From/:From/Count/:Count', {
            templateUrl: 'pages/weight_control_normal.html',
            controller: 'weightNormalController'
        })
          .when('/weightNormal/originalWeight/:originalWeight/barcode/:barcode/kodmesira/:kodmesira/countPictures/:countPictures/isPalet/:isPalet/MEM/:MEM/From/:From/Count/:Count/KodHanut/:KodHanut', {
              templateUrl: 'pages/weight_control_normal.html',
              controller: 'weightNormalController'
          })

     .when('/weightNormal/isYazum/:isYazum', {
         templateUrl: 'pages/weight_control_normal.html',
         controller: 'weightNormalController'
     })
        .when('/weightNormal/barcode/:barcode/isYzum/:isYzum', {
            templateUrl: 'pages/weight_control_normal.html',
            controller: 'weightNormalController'
        })
        .when('/weightNormal', {
            templateUrl: 'pages/weight_control_normal.html',
            controller: 'weightNormalController'
        })



     .when('/weightItem', {
         templateUrl: 'pages/weight_control_item.html',
         controller: 'weightItemController'
     })

          .when('/weightItem/originalWeight/:originalWeight/barcode/:barcode/kodmesira/:kodmesira/countPictures/:countPictures/MEM/:MEM', {
              templateUrl: 'pages/weight_control_item.html',
              controller: 'weightItemController'
          })

        .when('/weightItem/originalWeight/:originalWeight/barcode/:barcode/kodmesira/:kodmesira/countPictures/:countPictures/MEM/:MEM/From/:From/Count/:Count', {
            templateUrl: 'pages/weight_control_item.html',
            controller: 'weightItemController'
        })
            .when('/weightItem/originalWeight/:originalWeight/barcode/:barcode/kodmesira/:kodmesira/countPictures/:countPictures/MEM/:MEM/From/:From/Count/:Count/KodHanut/:KodHanut', {
                templateUrl: 'pages/weight_control_item.html',
                controller: 'weightItemController'
            })

         .when('/weightItem/barcode/:barcode', {
             templateUrl: 'pages/weight_control_item.html',
             controller: 'weightItemController'
         })



     .when('/weightPallet/barcode/:barcode/isYzum/:isYzum', {
         templateUrl: 'pages/weight_control_plate.html',
         controller: 'weightPalletController'
     })
          .when('/weightPallet/originalWeight/:originalWeghit/barcode/:barcode/kodmesira/:kodmesira/countPictures/:countPictures/isPalet/:isPalet/MEM/:MEM', {
              templateUrl: 'pages/weight_control_plate.html',
              controller: 'weightPalletController'
          })
        .when('/weightPallet/originalWeight/:originalWeghit/barcode/:barcode/kodmesira/:kodmesira/countPictures/:countPictures/isPalet/:isPalet/MEM/:MEM/From/:From/Count/:Count', {
            templateUrl: 'pages/weight_control_plate.html',
            controller: 'weightPalletController'
        })
          .when('/weightPallet/originalWeight/:originalWeghit/barcode/:barcode/kodmesira/:kodmesira/countPictures/:countPictures/isPalet/:isPalet/MEM/:MEM/From/:From/Count/:Count/KodHanut/:KodHanut', {
              templateUrl: 'pages/weight_control_plate.html',
              controller: 'weightPalletController'
          })


     .when('/balanceOk', {
         templateUrl: 'pages/report_ok.html',
         controller: 'reportOkController'
     })


     .when('/register', {
         templateUrl: 'pages/register.html',
         controller: 'registerController'
     })


    .when('/assignments_empty', {
         templateUrl: 'pages/assignments_empty.html',
         controller: 'Assignments_emptyController'
     })
      //.when('/assignments_all/', {
      //  templateUrl: 'pages/assignments_all.html',
      //  controller: 'assignmentsAllController'
      //})
       //.when('/assignments_collect/taskId/:taskId/contractId/:contractId/contactName/:contactName/contactPhoneNumber/:contactPhoneNumber/fromHour/:fromHour/toHour/:toHour/city/:city/street/:street/houseNumber/:houseNumber/newCaseNumber/:newCaseNumber/collect_floor/:collect_floor/collect_remarks/:collect_remarks', {

       // templateUrl: 'pages/assignments_collect.html',
       // controller: 'AssignmentsCollectController'

       //})

    .when('/optics_mesira_hanut', {
        templateUrl: 'pages/optica_mesira_takin_2.html',
        controller: 'opticsMesiraHanutController'
    })

     .when('/optics_mesira_sapak', {
         templateUrl: 'pages/optica_sapak_takin_2.html',
         controller: 'opticsMesiraSapakController'
     })
     .when('/optics_mesira_sapak/originalWeight/:originalWeight/barcode/:barcode/fixedWeight/:fixWeight/kodmesira/:kodmesira/countPictures/:countPictures/isPalet/:isPalet/MEM/:MEM/From/:From/Count/:Count/KodHanut/:KodHanut', {
         templateUrl: 'pages/optica_sapak_takin_2.html',
         controller: 'opticsMesiraSapakController'
     })

       .when('/optics_mesira_hanut/originalWeight/:originalWeight/barcode/:barcode/fixedWeight/:fixWeight/kodmesira/:kodmesira/countPictures/:countPictures/isPalet/:isPalet/MEM/:MEM/From/:From/Count/:Count/KodHanut/:KodHanut', {
           templateUrl: 'pages/optica_mesira_takin_2.html',
           controller: 'opticsMesiraHanutController'
       })
       .when('/optica_isuf', {
           templateUrl: 'pages/optics_isuf.html',
           controller: 'opticaIsuf'
       })

      .when('/mesimat_Mesira_Shlav_Rishon', {
          templateUrl: 'pages/mesima_mesira_achrei_isur_shlav_shlishi.html',
          controller: 'mesimatMesiraShlavRishon'
      })
       .when('/mesimat_Mesira_Shlav_Rishon/taskId/:taskId/contractId/:contractId/contactName/:contactName/contactPhoneNumber/:contactPhoneNumber/fromHour/:fromHour/toHour/:toHour/city/:city/street/:street/houseNumber/:houseNumber/newCaseNumber/:newCaseNumber/new_barkod/:new_barkod', {
          templateUrl: 'pages/mesima_mesira_achrei_isur_shlav_shlishi.html',                
          controller: 'mesimatMesiraShlavRishon'
                        
       })
            .when('/mesimat_Mesira_Shlav_Rishon/originalWeight/:originalWeight/barcode/:barcode/fixedWeight/:fixWeight/kodmesira/:kodmesira/countPictures/:countPictures/isPalet/:isPalet/MEM/:MEM/From/:From/Count/:Count', {
                templateUrl: 'pages/mesima_mesira_achrei_isur_shlav_shlishi.html',
                controller: 'mesimatMesiraShlavRishon'

            })

    //.when('/reportOk/JSONreport/:JSONreport', {
    //    templateUrl: 'pages/report_ok.html',
    //    controller: 'reportOkController'
    //})

    //   .when('/reportNOTOk/JSONreport/:JSONreport', {
    //       templateUrl: 'pages/report_not_ok.html',
    //       controller: 'reportNotOkController'
    //   })
     //.when('/assignments_collect/taskId/:taskId/contractId/:contractId/contactName/:contactName/contactPhoneNumber/:contactPhoneNumber/fromHour/:fromHour/toHour/:toHour/city/:city/street/:street/houseNumber/:houseNumber/newCaseNumber/:newCaseNumber', {
     //    templateUrl: 'pages/assignments_collect.html',
     //    controller: 'AssignmentsCollectController'
     //})
      //.when('/assignments_all/', {
      //    templateUrl: 'pages/assignments_all.html',
      //    controller: 'assignmentsAllController'
      //})

    ;

});

 