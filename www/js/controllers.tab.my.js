angular.module('starter.controllers.tab.my', [])

// 我的主页 的控制器
.controller('MyCtrl', ['$scope', '$rootScope', 'UsrInfoLocal', 'stateGo', function ($scope, $rootScope, UsrInfoLocal, stateGo) {

  // 设置页面进入监听事件
  $scope.$on("$ionicView.enter", function () {
    $rootScope.clearHistory();
  });

  $rootScope.$on('signin-success', function () {
    console.log("on signin-success");
    $scope.my.content = true;
    $scope.my.form = false;
  });

  $rootScope.$on('logout-success', function () {
    console.log('on logout-success');
    $scope.my.content = false;
    $scope.my.form = true;
  });

  // 控制个人信息视图显示
  $scope.my = $rootScope.my;

  // 本地用户信息共享部分
  $scope.uil = UsrInfoLocal;

  $scope.toSignInUp = function () {
    if (!$rootScope.isAutoLoading) {
      stateGo.goToState('signinup');
    }
  };

  // 我的页面进入检测事件
  $scope.$on("$ionicView.enter", function () {
    console.log("enter my");
    $rootScope.clearHistory();
    // if (UsrInfoLocal.empty === true) {
    //   console.log("empty");
    //   $rootScope.globalSignSymbol = false;
    //   $scope.my.content = false;
    //   $scope.my.form = true;
    //   $scope.usrinfo = {
    //     usrname: "",
    //     usrpassword: ""
    //   };
    // }
  });

  // 观察全局变量
  // $scope.$watch("globalSignSymbol", function (newValue, oldValue, scope) {
  //   console.log("change");
  //   if (newValue === true) {
  //     console.log("newValue: true");
  //     $scope.my.content = true;
  //     $scope.my.form = false;
  //   } else if (newValue === false) {
  //     console.log("newValue: false");
  //     $scope.my.content = false;
  //     $scope.my.form = true;
  //   }
  // }, true);

  }])

.controller('myDirectiveCtrl', ['$scope', '$element', '$attrs', '$transclude', function ($scope, $element, $attrs, $transclude) {
  // 测试directive的独立作用域和link函数,用在了shoppingcar.html上，删除时注意!

  $scope.collectionCount = "100";
  $scope.historyCount = {
    yesterday: "300",
    today: "200"
  };
  $scope.showvalue = function () {
    console.log("showvalue: " + $scope.value);
  };
  }])

// 登录注册页面的控制器
.controller('SignInUpCtrl', ['$scope', '$timeout', '$ionicModal', '$rootScope', 'ls', 'SignInOrUpFac', 'UsrInfoLocal', '$ionicHistory', function ($scope, $timeout, $ionicModal, $rootScope, ls, SignInOrUpFac, UsrInfoLocal, $ionicHistory) {

  // create modal
  // use for test
  $ionicModal.fromTemplateUrl("my-signup-modal.html", {
      scope: $scope,
      animation: 'slide-in-up'
    })
    .then(function (modal) {
      // console.log("modal success");
      $scope.signModal = modal;
    }, function (err) {
      console.log("err");
      console.log(err);
    });
  $scope.$on('$destroy', function () {
    $scope.signModal.remove();
  });
  $scope.openSignUpModal = function () {
    $scope.signModal.show();
  };
  $scope.closeSignUpModal = function () {
    $scope.signModal.hide();
  };
  $scope.$on("modal.show", function () {
    // todo
  });
  $scope.$on("modal.hidden", function () {
    // todo
  });
  $scope.$on("modal.removed", function () {
    // todo
  });

  // 提交账户信息相关
  // 对象形式，与子controller共享
  $scope.usrinfo = {
    usrname: "",
    usrpassword: ""
  };

  // 其他信息
  $scope.resultFail = false;
  $scope.resultErrorText = "";

  // 本地用户信息共享部分
  $scope.uil = UsrInfoLocal;

  // 登录提交回调函数
  $scope.loginSubmit = function () {
    SignInOrUpFac.signIn($scope.usrinfo.usrname, $scope.usrinfo.usrpassword)
      .then(function resolve(response) {
        // $scope.response = response;
        if (response.data.resultStatus === "success") {
          $scope.resultFail = false;

          $scope.uil.setid(response.data.resultData[0].id);
          $scope.uil.setUm(response.data.resultData[0].name);
          $scope.uil.setSpmid(response.data.resultData[0].sportmanid);
          $scope.uil.setAvatar(response.data.resultData[0].avatar);
          $scope.uil.setEmpty(false);

          $scope.uil.setEmail(response.data.resultData[0].email);
          $scope.uil.setPn(response.data.resultData[0].password);
          $scope.uil.setGender(response.data.resultData[0].gender);
          $scope.uil.setAddress(response.data.resultData[0].address);
          $scope.uil.setSocialbg(response.data.resultData[0].socialbg);

          // storage in local
          ls.set("id", response.data.resultData[0].id);
          ls.set("usrpassword", response.data.resultData[0].password);
          ls.set("usrname", response.data.resultData[0].name);
          ls.set("avatar", response.data.resultData[0].avatar);
          ls.set("sportmanid", response.data.resultData[0].sportmanid);

          ls.set("email", response.data.resultData[0].email);
          ls.set("phonenumber", response.data.resultData[0].mobile);
          ls.set("gender", response.data.resultData[0].gender);
          ls.set("address", response.data.resultData[0].address);
          ls.set('socialbg', response.data.resultData[0].socialbg);

          // console.log("on signinsuccess");

          // 清空本地登录信息存储
          $scope.usrinfo = undefined;

          $rootScope.globalSignSymbol = true;
          $rootScope.$emit('signin-success', '');

          $rootScope.toBackView();

        } else {
          $scope.resultFail = true;
          $scope.resultErrorText = "账户名或密码出错";
          $timeout(function () {
            $scope.resultFail = false;
          }, 4000);
        }
      }, function reject(err) {
        $scope.resultFail = "true";
        $scope.resultErrorText = "网络连接出错";
        $timeout(function () {
          $scope.resultFail = false;
        }, 4000);
        console.log("err");
        console.log(err);
      });
  };

  // 注册相关信息
  $scope.signupInfo = {
    usrname: "",
    usrpassword: ""
  };

  // 注册回调方法
  $scope.signupSubmit = function () {
    SignInOrUpFac.signUp($scope.signupInfo.usrname, $scope.signupInfo.usrpassword)
      .then(function resolve(response) {
        console.log(response.data.resultData);
        console.log(response.data.resultStatus);
        // console.log(response);
      }, function reject(err) {
        console.log("sign up fail");
        console.log(err);
      });
  };

  }])

// 用户详细页控制器
.controller('usrDetailCtrl', ['$scope', 'UsrInfoLocal', 'getData', 'api', '$rootScope', '$timeout', '$ionicPopup', function ($scope, UsrInfoLocal, getData, api, $rootScope, $timeout, $ionicPopup) {

  $scope.personInfo = {
    avatar: UsrInfoLocal.avatar,
    gender: UsrInfoLocal.gender,
    address: UsrInfoLocal.address,
    socialbg: UsrInfoLocal.socialbg
  };

  $scope.avatarList = [];
  $scope.socialbgList = [];

  $scope.saveChange = function () {
    console.log('$scope.personInfo', $scope.personInfo);
    getData.post(api.setting_person_info, {
      id: UsrInfoLocal.id,
      gender: $scope.personInfo.gender,
      address: $scope.personInfo.address
    }).then(function resolve(res) {
      console.log('saveChange res', res);
      if (res.data.resultStatus == 'success') {
        UsrInfoLocal.gender = res.data.resultData.gender;
        UsrInfoLocal.address = res.data.resultData.address;
        $rootScope.toBackView();
      }
    }, function reject(err) {
      console.log('saveChange err', err);
    });
  };

  $scope.uploadImg = function (files, type) {
    var fd = new FormData();
    console.log('uploadImg type', type);
    fd.append('type', type);
    fd.append('id_user', UsrInfoLocal.id);
    for (var i = 0, file; i < files.length; i++) {
      file = files[i];
      (function (file) {
          fd.append('imgs[]',file);
      })(file);
    }
    $.ajax({
      url: api.upload_img,
      type: 'POST',
      data: fd,
      dataType: 'json',
      contentType: false,
      processData: false,
      success: function (res) {
          console.log(res);
          if(res.resultStatus == 'success') {
            $scope.showResult('上传成功');
            UsrInfoLocal[type] = api.sportman_pic_prefix + res.resultData.ret[0].key;
            $scope.personInfo[type] = api.sportman_pic_prefix + res.resultData.ret[0].key;
          }else {
            $scope.showResult('上传失败');
          }
      },
      error: function (err) {
          $scope.showResult('网络出错');
          console.log(err);
      }
    });
  };

  angular.element('#avatarinput').on("change", function (e) {
    var files = e.target.files || e.dataTransfer.files;
    if(files.length == 0) {
      return;
    }
    $timeout(function () {
      console.log('files', files);
      var fileList = [];
      fileList.push(files[0]);
      console.log('fileList', fileList);
      $scope.uploadImg(fileList, 'avatar');
    }, 1);
  });

  angular.element('#soicalbginput').on("change", function (e) {
    var files = e.target.files || e.dataTransfer.files;
    if(files.length == 0) {
      return;
    }
    $timeout(function () {
      var files = e.target.files || e.dataTransfer.files;
      console.log('files', files);
      var fileList = [];
      fileList.push(files[0]);
      $scope.uploadImg(fileList, 'socialbg');
    }, 1);
  });

  $scope.showResult = function (result) {
    var alertPopup = $ionicPopup.alert({
      title: result,
      template: ''
    });
    alertPopup.then(function (res) {});
  };

}])

// 我的活动
.controller('myCollectionsActivityCtrl', ['$scope', '$rootScope', '$state', 'stateGo', function ($scope, $rootScope, $state, stateGo) {

  $scope.toBackView = function () {
    stateGo.goToBack({
      name: 'tab.my'
    });
  };

  }])

.controller('myCollectionsActivityComingCtrl', ['$scope', '$rootScope', 'stateGo', 'getData', 'api', 'UsrInfoLocal', function ($scope, $rootScope, stateGo, getData, api, UsrInfoLocal) {
  $scope.activityList = [];
  $scope.getDataPromise = '';
  $scope.hasFirstLoad = false;

  $scope.getActivityInfo = function () {
    $scope.getDataPromise = getData.post(api.user_activity, {
      id: UsrInfoLocal.id,
      status: '待举行'
    });
  };
  $scope.getActivityInfo();

  $scope.$on("$ionicView.enter", function () {
    $rootScope.clearHistory();
  });

  $scope.$on('$ionicView.afterEnter', function () {
    if (!$scope.hasFirstLoad) {
      console.log("firstLoad");
      $scope.hasFirstLoad = true;
      $scope.getDataPromise
        .then(function resolve(res) {
          $scope.activityList = res.data.resultData;
        }, function reject(err) {
          console.log("err:", err);
        });
    }
  });
  }])

.controller('myCollectionsActivityInvestigatingCtrl', ['$scope', '$rootScope', 'stateGo', 'getData', 'api', 'UsrInfoLocal', function ($scope, $rootScope, stateGo, getData, api, UsrInfoLocal) {
  $scope.$on("$ionicView.enter", function () {
    $rootScope.clearHistory();
  });
  $scope.activityList = [];

  $scope.getActivityInfo = function () {
    getData.post(api.user_activity, {
        id: UsrInfoLocal.id,
        status: '审核中'
      })
      .then(function resolve(res) {
        $scope.activityList = res.data.resultData;
      }, function reject(err) {
        console.log("err:", err);
      });
  };
  $scope.getActivityInfo();
  }])

.controller('myCollectionsActivityFinishedCtrl', ['$scope', '$rootScope', 'stateGo', 'getData', 'api', 'UsrInfoLocal', function ($scope, $rootScope, stateGo, getData, api, UsrInfoLocal) {
  $scope.$on("$ionicView.enter", function () {
    $rootScope.clearHistory();
  });

  $scope.activityList = [];

  $scope.getActivityInfo = function () {
    getData.post(api.user_activity, {
        id: UsrInfoLocal.id,
        status: '已结束'
      })
      .then(function resolve(res) {
        // console.log("res.data:", res.data);
        $scope.activityList = res.data.resultData;
      }, function reject(err) {
        console.log("err:", err);
      });
  };
  $scope.getActivityInfo();
  }])

.controller('myCollectionsActivityAllCtrl', ['$scope', '$rootScope', 'stateGo', 'getData', 'api', 'UsrInfoLocal', function ($scope, $rootScope, stateGo, getData, api, UsrInfoLocal) {
  $scope.$on("$ionicView.enter", function () {
    $rootScope.clearHistory();
  });

  $scope.show_status = true;

  $scope.activityList = [];

  $scope.getActivityInfo = function () {
    getData.post(api.user_activity, {
        id: UsrInfoLocal.id,
        status: 'all'
      })
      .then(function resolve(res) {
        // console.log("res.data:", res.data);
        $scope.activityList = res.data.resultData;
      }, function reject(err) {
        console.log("err:", err);
      });
  };
  $scope.getActivityInfo();
  }])

// 我的场馆
.controller('myCollectionsStadiumCtrl', ['$scope', 'stateGo', function ($scope, stateGo) {

  $scope.toBackView = function () {
    stateGo.goToBack({
      name: 'tab.my'
    });
  };

  }])

.controller('myCollectionsStadiumAvailableCtrl', ['$scope', '$rootScope', 'getData', 'api', 'UsrInfoLocal', function ($scope, $rootScope, getData, api, UsrInfoLocal) {
  $scope.stadiumList = [];
  $scope.getDataPromise = '';
  $scope.hasFirstLoad = false;

  $scope.getStadiumList = function () {
    $scope.getDataPromise = getData.post(api.user_stadium, {
      id: UsrInfoLocal.id,
      status: '待使用'
    });
  };
  $scope.getStadiumList();

  $scope.$on("$ionicView.enter", function () {
    $rootScope.clearHistory();
  });

  $scope.$on('$ionicView.afterEnter', function () {
    if (!$scope.hasFirstLoad) {
      console.log("firstLoad");
      $scope.hasFirstLoad = true;
      $scope.getDataPromise
        .then(function resolve(res) {
          console.log("res.data:", res.data);
          $scope.stadiumList = res.data.resultData;
        }, function reject(err) {
          console.log("err:", err);
        });
    }
  });

  }])

.controller('myCollectionsStadiumUsedCtrl', ['$scope', '$rootScope', 'getData', 'api', 'UsrInfoLocal', function ($scope, $rootScope, getData, api, UsrInfoLocal) {
  $scope.stadiumList = [];

  $scope.getStadiumList = function () {
    getData.post(api.user_stadium, {
        id: UsrInfoLocal.id,
        status: '已使用'
      })
      .then(function resolve(res) {
        console.log("res.data:", res.data);
        $scope.stadiumList = res.data.resultData;
      }, function reject(err) {
        console.log("err:", err);
      });
  };
  $scope.getStadiumList();

  $scope.$on("$ionicView.enter", function () {
    $rootScope.clearHistory();
  });
  }])

.controller('myCollectionsStadiumAllCtrl', ['$scope', '$rootScope', 'getData', 'api', 'UsrInfoLocal', function ($scope, $rootScope, getData, api, UsrInfoLocal) {
  $scope.stadiumList = [];
  $scope.show_status = true;

  $scope.getStadiumList = function () {
    getData.post(api.user_stadium, {
        id: UsrInfoLocal.id,
        status: 'all'
      })
      .then(function resolve(res) {
        console.log("res.data:", res.data);
        $scope.stadiumList = res.data.resultData;
      }, function reject(err) {
        console.log("err:", err);
      });
  };
  $scope.getStadiumList();

  $scope.$on("$ionicView.enter", function () {
    $rootScope.clearHistory();
  });
  }])

// 我的收藏
.controller('myCollectionStarCtrl', ['$scope', 'stateGo', function ($scope, stateGo) {

  $scope.toBackView = function () {
    stateGo.goToBack({
      name: 'tab.my'
    });
  };

  }])

.controller('myCollectionStarActivityCtrl', ['$scope', '$rootScope', 'getData', 'api', 'UsrInfoLocal', function ($scope, $rootScope, getData, api, UsrInfoLocal) {

  $scope.activityList = [];
  $scope.getDataPromise = '';
  $scope.hasFirstLoad = false;

  $scope.getActivityList = function () {
    $scope.getDataPromise = getData.post(api.user_activity_star, {
      id: UsrInfoLocal.id
    });
  };
  $scope.getActivityList();

  $scope.$on("$ionicView.enter", function () {
    $rootScope.clearHistory();
  });

  $scope.$on("$ionicView.afterEnter", function () {
    if (!$scope.hasFirstLoad) {
      $scope.hasFirstLoad = true;
      $scope.getDataPromise
        .then(function resolve(res) {
          $scope.activityList = $scope.activityList.concat(res.data.resultData);
        }, function reject(err) {
          console.log('err:', err);
        });
    }
  });
  }])

.controller('myCollectionStarStadiumCtrl', ['$scope', '$rootScope', 'getData', 'api', 'UsrInfoLocal', function ($scope, $rootScope, getData, api, UsrInfoLocal) {
  $scope.stadiumList = [];

  $scope.getStadiumList = function () {
    getData.post(api.user_stadium_star, {
        id: UsrInfoLocal.id
      })
      .then(function resolve(res) {
        $scope.stadiumList = $scope.stadiumList.concat(res.data.resultData);
      }, function reject(err) {
        console.log('err:', err);
      });
  };
  $scope.getStadiumList();

  $scope.$on("$ionicView.enter", function () {
    $rootScope.clearHistory();
  });

  }])


// 我的评论
.controller('myReviewCtrl', ['$scope', 'stateGo', function ($scope, stateGo) {

  $scope.toBackView = function () {
    stateGo.goToBack({
      name: 'tab.my'
    });
  };

  }])

.controller('myReviewActivityCtrl', ['$scope', '$rootScope', 'getData', 'api', 'UsrInfoLocal', function ($scope, $rootScope, getData, api, UsrInfoLocal) {
  $scope.reviewActivityList = [];
  $scope.getDataPromise = '';
  $scope.hasFirstLoad = false;

  $scope.getReviewActivityList = function () {
    $scope.getDataPromise = getData.post(api.user_review, {
      id: UsrInfoLocal.id,
      type: 'activity'
    });
  };
  $scope.getReviewActivityList();

  $scope.$on('$ionicView.enter', function () {
    $rootScope.clearHistory();
  });

  $scope.$on('$ionicView.afterEnter', function () {
    if (!$scope.hasFirstLoad) {
      $scope.hasFirstLoad = true;
      $scope.getDataPromise
        .then(function resolve(res) {
          $scope.reviewActivityList = $scope.reviewActivityList.concat(res.data.resultData);
        }, function reject(err) {
          console.log('err:', err);
        });
    }
  });
  }])

.controller('myReviewStadiumCtrl', ['$scope', '$rootScope', 'getData', 'api', 'UsrInfoLocal', function ($scope, $rootScope, getData, api, UsrInfoLocal) {
  $scope.reviewStadiumList = [];

  $scope.getReviewStadiumList = function () {
    getData.post(api.user_review, {
      id: UsrInfoLocal.id,
      type: 'stadium'
    }).then(function resolve(res) {
      $scope.reviewStadiumList = $scope.reviewStadiumList.concat(res.data.resultData);
    }, function reject(err) {
      console.log('err:', err);
    });
  };
  $scope.getReviewStadiumList();
  }])

// 我的历史
.controller('myHistoryCtrl', ['$scope', 'getData', 'api', 'UsrInfoLocal', function ($scope, getData, api, UsrInfoLocal) {
  $scope.historyList = [];
  $scope.getDataPromise = '';
  $scope.hasFirstLoad = false;

  $scope.getHistoryList = function () {
    $scope.getDataPromise = getData.post(api.user_history, {
      id: UsrInfoLocal.id
    });
  };
  $scope.getHistoryList();

  $scope.$on('$ionicView.afterEnter', function () {
    if (!$scope.hasFirstLoad) {
      $scope.hasFirstLoad = true;
      $scope.getDataPromise
        .then(function resolve(res) {
          console.log('res.data:', res.data);
          $scope.historyList = $scope.historyList.concat(res.data.resultData);
        }, function reject(err) {
          console.log('err:', err);
        });
    }
  });
  }])

// 我的推荐
.controller('myRecommendCtrl', ['$scope', 'stateGo', function ($scope, stateGo) {

  $scope.toBackView = function () {
    stateGo.goToBack({
      name: 'tab.my'
    });
  };

  }])

.controller('myRecommendActivityCtrl', ['$scope', 'getData', 'api', 'UsrInfoLocal', function ($scope, getData, api, UsrInfoLocal) {
  $scope.recommendActivityList = [];
  $scope.getDataPromise = '';
  $scope.hasFirstLoad = false;

  $scope.getRecommendActivityList = function () {
    $scope.getDataPromise = getData.post(api.user_activity_recommend, {
      id: UsrInfoLocal.id
    });
  };
  $scope.getRecommendActivityList();

  $scope.$on('$ionicView.afterEnter', function () {
    if (!$scope.hasFirstLoad) {
      $scope.hasFirstLoad = true;
      $scope.getDataPromise
        .then(function resolve(res) {
          $scope.recommendActivityList = $scope.recommendActivityList.concat(res.data.resultData);
        }, function reject(err) {
          console.log('err:', err);
        });
    }
  });
  }])

.controller('myRecommendStadiumCtrl', ['$scope', 'getData', 'api', 'UsrInfoLocal', function ($scope, getData, api, UsrInfoLocal) {
  $scope.recommendStadiumList = [];

  $scope.getRecommendStadiumList = function () {
    getData.post(api.user_stadium_recommend, {
      id: UsrInfoLocal.id
    }).then(function resolve(res) {
      $scope.recommendStadiumList = $scope.recommendStadiumList.concat(res.data.resultData);
    }, function reject(err) {
      console.log('err:', err);
    });
  }
  $scope.getRecommendStadiumList();

  }])

// 付款管理
.controller('myPaymentCtrl', ['$scope', 'stateGo', 'getData', 'api', 'UsrInfoLocal', function ($scope, stateGo, getData, api, UsrInfoLocal) {

  $scope.toBackView = function () {
    stateGo.goToBack({
      name: 'tab.my'
    });
  };

  $scope.preparePay = function (id_payment, type, payTotalPrice) {
    stateGo.goToState('prepare-pay', {
      info: {
        id: UsrInfoLocal.id,
        id_payment: id_payment,
        type: type,
        payTotalPrice: payTotalPrice
      }
    });
  };
  }])

.controller('myPaymentActivityCtrl', ['$scope', 'getData', 'api', 'UsrInfoLocal', function ($scope, getData, api, UsrInfoLocal) {
  $scope.paymentActivityList = [];
  $scope.getDataPromise = '';
  $scope.hasFirstLoad = false;

  $scope.getPaymentActivityList = function () {
    $scope.getDataPromise = getData.post(api.user_payment_activity, {
      id: UsrInfoLocal.id
    });
  };
  $scope.getPaymentActivityList();

  $scope.$on('$ionicView.afterEnter', function () {
    if (!$scope.hasFirstLoad) {
      console.log('no first');
      $scope.hasFirstLoad = true;
      $scope.getDataPromise
        .then(function resolve(res) {
          $scope.paymentActivityList = $scope.paymentActivityList.concat(res.data.resultData);
        }, function reject(err) {
          console.log('err:', err);
        });
    }
  });

  }])

.controller('myPaymentStadiumCtrl', ['$scope', 'getData', 'api', 'UsrInfoLocal', function ($scope, getData, api, UsrInfoLocal) {
  $scope.paymentStadiumList = [];

  $scope.getPaymentStadiumList = function () {
    getData.post(api.user_payment_stadium, {
      id: UsrInfoLocal.id
    }).then(function resolve(res) {
      $scope.paymentStadiumList = $scope.paymentStadiumList.concat(res.data.resultData);
    }, function reject(err) {
      console.log('err:', err);
    });
  };
  $scope.getPaymentStadiumList();
  }])

.controller('myPaymentPaidCtrl', ['$scope', 'getData', 'api', 'UsrInfoLocal', function ($scope, getData, api, UsrInfoLocal) {
  $scope.paidActivityList = [];
  $scope.paidStadiumList = [];

  $scope.getPaymentList = function () {
    getData.post(api.user_payment_all, {
      id: UsrInfoLocal.id
    }).then(function resolve(res) {
      console.log('getPaymentList res', res);
      $scope.paidActivityList = $scope.paidActivityList.concat(res.data.resultData.paid_activity);
      $scope.paidStadiumList = $scope.paidStadiumList.concat(res.data.resultData.paid_stadium);
    }, function reject(err) {
      console.log('err:', err);
    });
  };
  $scope.getPaymentList();

  $scope.cancelPaidActivity = function (id, id_payment, type) {
    console.log('cancelPaid id_payment', id_payment);
    getData.post(api.activity_deletepayment, {
      id: UsrInfoLocal.id,
      id_activity: id
    }).then(function resolve (res) {
      console.log('cancelPaidActivity res', res);
    }, function reject (err) {
      console.log('cancelPaidActivity err', err);
    });
  };

  $scope.cancelPaidStadium = function (id, id_payment, type) {
    console.log('cancelPaid id_payment', id_payment);
    getData.post(api.stadium_deletepayment, {
      id: UsrInfoLocal.id,
      id_stadium: id,
      id_payment: id_payment
    }).then(function resolve (res) {
      console.log('cancelPaidActivity res', res);
    }, function reject (err) {
      console.log('cancelPaidActivity err', err);
    });
  };

  }])

// 消息推送
.controller('mySubscription', ['$scope', '$state', '$rootScope', 'stateGo', function ($scope, $state, $rootScope, stateGo) {

  $scope.toBackView = function () {
    stateGo.goToBack({
      name: 'tab.my'
    });
  };

  $scope.$on("$ionicView.enter", function () {
    $rootScope.clearHistory();
  });

  $scope.tab = {
    activities: true,
    companies: false
  };

  $scope.contentList = {
    activities: [],
    companies: []
  };

  $scope.getMoreActiviesList = function () {

  };
  $scope.getMoreCompaniesList = function () {

  };
  }])

.controller('mySubscriptionActivities', ['$scope', '$rootScope', '$ionicHistory', function ($scope, $rootScope, $ionicHistory) {
  console.log("init mySubscriptionActivities");

  $scope.$on("$ionicView.enter", function () {
    $rootScope.clearHistory();
  });
  }])

.controller('mySubscriptionCompanies', ['$scope', '$rootScope', '$ionicHistory', function ($scope, $rootScope, $ionicHistory) {
  console.log("init mySubscriptionCompanies");

  $scope.$on("$ionicView.enter", function () {
    $rootScope.clearHistory();
  });
  }]);
