"ui";
ui.layout(
    <frame>
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="引流助手720p-v1.1"></toolbar>
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
                <text textSize="16sp" textColor="black">评论页面上滑设置:</text>
                <horizontal>
                    <text textSize="16sp" textColor="black">上滑距离</text>
                    <input gravity="center" width="50" id="avatar_slide_up_distance" text="150" inputType="number" />
                    <text textSize="16sp" textColor="black">总次数</text>
                    <input gravity="center" width="50" id="avatar_slide_up_num" text="150" inputType="number" />
                </horizontal>
                <button id="start" text="开始" />
                <button id="stop" text="停止" />
                <text margin="10">手机系统Android7.0以上，关闭系统动画以提高性能。</text>
                <text margin="10">使用前请打开无障碍服务，授予录屏权限。</text>
                <text margin="10">若退出本服务请点击停止按钮。</text>
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
var avatar_slide_up_distance = storage.get("avatar_slide_up_distance", "150");
var avatar_slide_up_num = storage.get("avatar_slide_up_num", "3");
// var avatar_slide_up_time = storage.get("avatar_slide_up_time", 500);
ui.sp1.setSelection(sex);
ui.start_age.setText(start_age);
ui.end_age.setText(end_age);
ui.sp2.setSelection(func_position);
ui.avatar_slide_up_distance.setText(avatar_slide_up_distance);
ui.avatar_slide_up_num.setText(avatar_slide_up_num);

ui.start.click(function () {
    if (!checkTime()) return;
    sex = ui.sp1.getSelectedItemPosition();
    start_age = ui.start_age.getText();
    end_age = ui.end_age.getText();
    avatar_slide_up_distance = ui.avatar_slide_up_distance.getText();
    avatar_slide_up_num = ui.avatar_slide_up_num.getText();
    func_position = ui.sp2.getSelectedItemPosition();
    storage.put("sex", sex);
    storage.put("start_age", String(start_age));
    storage.put("end_age", String(end_age));
    storage.put("avatar_slide_up_distance", String(avatar_slide_up_distance));
    storage.put("avatar_slide_up_num", String(avatar_slide_up_num));
    storage.put("func_position", func_position);

    console.log("功能选择:" + func_position);
    toast("功能" + func_position + " 启动中，请稍后。。。");
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

function checkTime() {
    let time = new Date().getTime();
    return time < 1647918212000;
}

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
        click(125, 400);
        click(125, 400);
        checkUser()
        back();
        sleep(200);
        swipe(150, 400 + 135, 150, 400, 800);
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
    var max_swipe = avatar_slide_up_num;
    while (1) {
        if (text("没有更多了").exists() || max_swipe <= 0) {
            console.log("没有更多评论");
            toast("没有更多评论");
            back();
            swipeToNextVideo();
            clickMessagesIcon();
            max_swipe = avatar_slide_up_num;
        }
        // var avatar = findAvatar(30, 500);
        var nickname= findNickName(400);
        if (nickname) {
            console.log(nickname.text());
            var bounds = nickname.bounds()
            click(bounds.centerX(), bounds.centerY())
            checkUser();
            back();
        }
        sleep(200);
        //slide up to find next avatar
        swipe(10, 700 + Number(avatar_slide_up_distance), 10, 700, 500);
        max_swipe -= 1;
    }
}


function swipeToNextVideo() {
    sleep(2000);
    swipe(300, 900, 300, 900 - 700, 200);
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
    click(message_mid_bounds.centerX(), message_mid_bounds.centerY());
}

var temp_nickname = "";
function findNickName(y) {
    var titles = id("title").find();
    for (var i = 0; i < titles.length; i++) {
        var title = titles[i];
        if (title.text() != "" && title.bounds().centerY() > y && title.bounds().centerY() < (y+138)) {
            if(temp_nickname == title.text()){
                console.log('昵称重复')
                return;
            }
            temp_nickname = title.text();
            return title;
        }
    }
    // console.log(titles.size());
}

function findAvatar(x, y) {
    sleep(300);
    var img = captureScreen();
    var point = findColor(img, "#000000", {
        region: [x, y, 68, 120],
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
    if (y > 780) return;
    var margin = bounds.height() / 4;
    click(x + margin, y + margin);
    click(x + margin * 3 + 5, y + margin * 3);
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
    console.log("find age " + start + " to " + end);
    for (i = start; i <= end; i++) {
        if (text(i + "岁").exists()) {
            return text(i + "岁").findOne().bounds();
        }
    }
    return false;
}