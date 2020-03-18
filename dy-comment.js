auto();
app.launchPackage("com.ss.android.ugc.aweme");
if (!requestScreenCapture()) {
    toast("请求截图失败");
    exit();
}
console.log(currentActivity());

waitForActivity(
    "com.ss.android.ugc.aweme.main.MainActivity",
    [(period = 200)]
);

sleep(2000);
id("a59").findOne().click();
sleep(2000);
// id("do8").findOne().children().forEach(child => {
//     var target = child.findOne(id("ayz"));
//     console.log(target.bounds());
// });
var target = id("ayz").findOne();
var bounds = target.bounds();
console.log(bounds);
click(bounds.left, bounds.top);
sleep(1000);
back();