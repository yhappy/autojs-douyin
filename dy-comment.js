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
       checkUser();
       back();
   }
   sleep(2000);
   swipe(30, 1000, 30, 1000 - 210 , 500);
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
    sleep(300);
    var img = captureScreen();
    var point = findColor(img, "#000000", {
        region: [x, y, 140, 170],
        threshold: 230
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
    console.log(currentActivity());
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
        toast("年龄不符");
    }
}

function findFitAge(start, end) {
    for (i = start; i <= end; i++) {
        if (text(i + "岁").exists()) {
            return text(i + "岁").findOne().bounds();
        }
    }
    return false;
}

function sexCheck(bounds) {
    var x = bounds.left;
    var y = bounds.top;
    if (y > 1200) return;
    var margin = bounds.height() / 4;
    click(x + margin, y + margin);
    click(x + margin * 3 + 5, y + margin * 3);
    sleep(100);
    var img = captureScreen();
    var point = findColor(img, "#d64765", {
        region: [x, y, margin * 3, margin * 3],
        threshold: 4
    });
    if (point) {
        console.log("girl" + point);
        click(point.x, point.y);
        toast("女");
    } else {
        console.log("boy");
        toast("男");
    }
}