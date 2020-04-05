"ui";
ui.layout(
    <frame>
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="引流助手1080x2080-v1.0"></toolbar>
            </appbar>
            <vertical margin="10">
                <text textSize="16sp" textColor="black">请选择关注性别:</text>
                <spinner id="sp1" entries="-♀女性❤-|-♂男性💙-"></spinner>
                <text textSize="16sp" textColor="black">请输入关注年龄范围:</text>
                <horizontal>
                    <input gravity="center" width="50" id="start_age" text="23" inputType="number" />
                    <text textSize="16sp" textColor="black">岁 ~ </text>
                    <input gravity="center" width="50" id="end_age" text="69" inputType="number" />
                    <text textSize="16sp" textColor="black">岁</text>
                </horizontal>
                <text textSize="16sp" textColor="black">请选择功能：</text>
                <spinner id="sp2" entries="-0️⃣粉丝页面分性别年龄关注-|-1️⃣评论页面分性别年龄关注-"></spinner>
                <button id="start" text="开始" />
                <button id="stop" text="停止" />
                <text margin="10">手机系统Android7.0以上，关闭系统动画以提高性能。</text>
                <text margin="10">使用前请打开无障碍服务，授予录屏权限。</text>
            </vertical>
        </vertical>
    </frame>
);

var userCount = 0;
var userMatch = 0;
var storage = storages.create("com.dy.tools");
var sex = storage.get("sex", 0);
var start_age = storage.get("start_age", "23");
var end_age = storage.get("end_age", "69");
var func_position = storage.get("func_position", 1);
ui.sp1.setSelection(sex);
ui.start_age.setText(start_age);
ui.end_age.setText(end_age);
ui.sp2.setSelection(func_position);

ui.start.click(function () {
    sex = ui.sp1.getSelectedItemPosition();
    start_age = ui.start_age.getText();
    end_age = ui.end_age.getText();
    func_position = ui.sp2.getSelectedItemPosition();
    storage.put("sex", sex);
    storage.put("start_age", String(start_age));
    storage.put("end_age", String(end_age));
    storage.put("func_position", func_position);

    console.log("功能选择:" + func_position);
    toast("功能" + func_position +" 启动中，请稍后。。。");
    switch (func_position) {
        case 0:
            threads.start(function () {
                relationTabCheckToFollow();
            });
            break;
        case 1:
            threads.start(function () {
                commentToFollow();
            });
            break;
    }
});

ui.stop.click(function () {
    exit();
    toast("已停止");
});

function relationTabCheckToFollow() {
    "auto";
    if (!requestScreenCapture()) {
        toast("请求截图失败");
        exit();
    }
    app.launchPackage("com.ss.android.ugc.aweme");
    toast('请手动进入粉丝页面');
    waitForActivity(
        "com.ss.android.ugc.aweme.following.ui.FollowRelationTabActivity",
        [(period = 200)]
    );
    // console.log("粉丝关系页面");
    sleep(2000);
    var loop = 5000;
    while (loop > 0) {
        console.log(currentActivity());
        console.log("loop: " + loop);
        loop--;
        click(125, 947);
        click(125, 947);
        checkUser()
        back();
        sleep(200);
        swipe(150, 930, 150, 700, 800);
        sleep(200);

    }
}

function commentToFollow() {
    auto();
    if (!requestScreenCapture()) {
        toast("请求截图失败");
        exit();
    }
    app.launchPackage("com.ss.android.ugc.aweme");
    sleep(2000);
    console.log(currentActivity());
    clickMessagesIcon();
    while (1) {
        if (text("没有更多了").exists()) {
            console.log("没有更多评论");
            toast("没有更多评论");
            back();
            swipeToNextVideo();
            clickMessagesIcon();
            continue;
        }
        var avatar = findAvatar(0, 1200);
        if (avatar) {
            click(avatar.x, avatar.y)
            checkUser();
            back();
        }
        sleep(200);
        swipe(30, 1000, 30, 1000 - 230, 500);
    }
}

function swipeToNextVideo() {
    sleep(2000);
    swipe(400, 1200, 400, 1200 - 1000, 300);
    sleep(2000);
}


function clickMessagesIcon() {
    sleep(1000);
    descStartsWith("评论").waitFor();
    var message_icon = descStartsWith("评论").find();
    message_icon_size = message_icon.size();
    console.log("message icon size:" + message_icon_size);
    var message_mid = message_icon[message_icon_size - 3];
    var message_mid_bounds = message_mid.bounds();
    var message_mid_desc = message_mid.desc();
    if (message_mid_desc == "评论评论，按钮") {
        console.log("无评论");
        toast("无评论");
        swipeToNextVideo();
        clickMessagesIcon();
    }
    // click(message_mid_bounds.centerX(), message_mid_bounds.centerY());
    click(1000,1555);
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
    sleep(1000);
    userCount += 1;
    sleep(1000);
    textContains("抖音号").waitFor();
    console.log("找到抖音号");
    var result = findFitAge(start_age, end_age);
    console.log("age result: " + result);
    if (result) {
        console.log("find age");
        var age_bounds = result;
        console.log(bounds);
        sexCheck(age_bounds);
    } else {
        console.log("age not match")
        toast("年龄不符");
    }
}

function sexCheck(bounds) {
    var x = bounds.left;
    var y = bounds.top;
    var sexColorList = ["#d64765", "#0da2b8"];
    var sexStringList = ['女', '男'];
    var sexColor = sexColorList[sex];
    var sexString = sexStringList[sex];
    if (y > 1200) return;
    var margin = bounds.height() / 4;
    // click(x + margin, y + margin);
    // click(x + margin * 3 + 5, y + margin * 3);
    sleep(300);
    var img = captureScreen();
    var point = findColor(img, sexColor, {
        region: [x, y, margin * 3, margin * 3],
        threshold: 4
    });
    if (point) {
        console.log(sexString + point);
        // click(point.x, point.y);
        text("关注").findOne().click();
        userMatch += 1;
        toast(sexString + ":已关注，本轮共" + userCount + "，已找到" + userMatch);
        sleep(200);
    } else {
        console.log("sex not match");
        toast("性别不符");
    }
}

function findFitAge(start, end) {
    6
    console.log("find age " + start + " to " + end);
    for (i = start; i <= end; i++) {
        if (text(i + "岁").exists()) {
            return text(i + "岁").findOne().bounds();
        }
    }
    return false;
}