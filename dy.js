auto();
app.launchPackage("com.ss.android.ugc.aweme");
if (!requestScreenCapture()) {
    toast("请求截图失败");
    exit();
}
waitForActivity(
    "com.ss.android.ugc.aweme.following.ui.FollowRelationTabActivity",
    [(period = 200)]
);
console.log("粉丝关系页面");
sleep(2000);
var loop = 5000;
while (loop > 0) {
    console.log("loop: " + loop);
    loop--;
    console.log(currentActivity());
    sleep(100);
    click(125, 947);
    click(125, 947);
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
    back();
    sleep(200);
    swipe(150, 900, 150, 720, 800);
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


function findFitAge(start, end) {
    for (i = start; i <= end; i++) {
        if (text(i + "岁").exists()) {
            return text(i + "岁").findOne().bounds();
        }
    }
    return false;
}


/**如果弹出青少年窗口，点击 */
function youngWin() {
    if ((youngWin = text("我知道了").exists())) {
        youngWin.click();
    }
}

/**随机点赞并休息一秒 */
function heartClick() {
    index = random(1, 5);
    if (index == 3) {
        id("a4o").findOnce().click();
    }
    sleep(1000);
}

//检测到新版本跳过
function newVersion() {
    if ((newVersion = text("以后再说").exists())) {
        newVersion.click();
    }
}
/**
 * 自动提交评论
 * content str 评论内容，默认为666
 */
function autoComment() {
    id("pz").findOnce().click();
    sleep(1000);
    b = id("pz").findOnce().bounds();
    sleep(1000);
    click(b.centerX(), b.centerY());
    sleep(1000);
    setText(content);
    sleep(1000);
    click(b.centerX(), b.centerY());
    sleep(1000);
    click(device.width - 80, b.centerY());
    sleep(1000);
    back();
}
