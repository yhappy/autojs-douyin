auto();
app.launchPackage("com.ss.android.ugc.aweme");
if (!requestScreenCapture()) {
    toast("请求截图失败");
    exit();
}
console.log(currentActivity());
clickMessageIcon();
while (1) {
   var avatar = findAvatar(0, 1000);
   if(avatar){
       click(avatar.x, avatar.y)
       sleep(2000);
       back();
   }
   sleep(2000);
   swipe(30, 1000, 30, 820, 800);
}

function clickMessageIcon() {
    waitForActivity(
        "com.ss.android.ugc.aweme.main.MainActivity",
        [(period = 200)]
    );
    var message_icon = id("a59").find();
    message_icon_size = message_icon.size();
    console.log(message_icon_size)
    var message_bounds = message_icon[message_icon_size - 2].bounds()
    console.log(message_bounds);
    click(message_bounds.centerX(), message_bounds.centerY());
}

function findAvatar(x, y) {
    var img = captureScreen();
    var point = findColor(img, "#000000", {
        region: [x, y, 140, 170],
        threshold: 40
    });
    if (point) {
        console.log("find avatar:" + point);
        return point;
    } else {
        console.log("no match");
        return false;
    }
}

function checkUser() {
    waitForActivity(
        "com.ss.android.ugc.aweme.profile.ui.UserProfileActivity",
        [(period = 100)]
    );
    console.log("个人信息页面");
    sleep(500);
    var result = findFitAge(1, 99);
    console.log("age result: " + result);
    if (result) {
        console.log("find age");
        var age_bounds = result;
        console.log(bounds);
        sexCheck(age_bounds);
        //click or not
    } else {
        console.log("not find age")
        toast("无年龄");
    }
}