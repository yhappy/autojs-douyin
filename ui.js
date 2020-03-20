"ui";

ui.layout(
    <frame>
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="Dytools v1.0"></toolbar>
            </appbar>
            <vertical margin="10">
                <text textSize="16sp" textColor="black">请选择关注性别:</text>
                <spinner id="sp1" entries="-♀女性❤-|-♂男性💙-"></spinner>
                <text textSize="16sp" textColor="black">请输入关注年龄范围:</text>
                <horizontal>
                    <input gravity="center" width="50" id="start_age" text="23" inputType="number" />
                    <text textSize="16sp" textColor="black">岁 ~ </text>
                    <input gravity="center" width="50" id="end_age" text="99" inputType="number" />
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
ui.start.click(function () {
    ui.sp2.setSelection(1);
    var sex = ui.sp1.getSelectedItemPosition();
    var start_age = ui.start_age.getText();
    var end_age = ui.end_age.getText();
    var func_position = ui.sp2.getSelectedItemPosition();
    console.log("功能选择:" + func_position);
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
    console.log("粉丝关系页面");
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
    console.log(currentActivity());
    clickMessagesIcon();
    while (1) {
        if (text("没有更多了").exists()) {
            console.log("没有更多了");
            toast("没有更多了");
            back();
            swipeToNextVideo();
            clickMessagesIcon();
            continue;
        }
        var avatar = findAvatar(0, 1000);
        if (avatar) {
            click(avatar.x, avatar.y)
            checkUser();
            back();
        }
        sleep(200);
        swipe(30, 1000, 30, 1000 - 210, 500);
    }
}

function swipeToNextVideo(){
    sleep(2000);
    swipe(400, 1200, 400, 1200 - 1000, 300);
    sleep(2000);
}


function clickMessagesIcon() {
    waitForActivity(
        "com.ss.android.ugc.aweme.main.MainActivity",
        [(period = 200)]
    );
    descStartsWith("评论").waitFor();
    var message_icon = descStartsWith("评论").find();
    message_icon_size = message_icon.size();
    console.log("message icon size:" + message_icon_size);
    var message_mid = message_icon[message_icon_size - 3];
    var message_mid_bounds = message_mid.bounds();
    var message_mid_desc =message_mid.desc();
    if(message_mid_desc == "评论评论，按钮"){
        console.log("无评论");
        toast("无评论");
        swipeToNextVideo();
        clickMessagesIcon();
    }
    click(message_mid_bounds.centerX(), message_mid_bounds.centerY());
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
    textContains("抖音号").waitFor();
    var result = findFitAge(1, 99);
    console.log("age result: " + result);
    if (result) {
        console.log("find age");
        var age_bounds = result;
        console.log(bounds);
        sexCheck(age_bounds);
    } else {
        console.log("not find age")
        toast("年龄不符");
    }
}

function sexCheck(bounds) {
    var x = bounds.left;
    var y = bounds.top;
    if (y > 1200) return;
    var margin = bounds.height() / 4;
    // click(x + margin, y + margin);
    // click(x + margin * 3 + 5, y + margin * 3);
    sleep(300);
    var img = captureScreen();
    var point = findColor(img, "#d64765", {
        region: [x, y, margin * 3, margin * 3],
        threshold: 4
    });
    if (point) {
        console.log("girl" + point);
        // click(point.x, point.y);
        text("关注").findOne().click();
        toast("女，已关注");
        sleep(200);
    } else {
        console.log("sex not match");
        toast("性别不符");
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