auto();
console.log(currentActivity());

let course_str = ['1.3', '1.5','2.1','2.2','2.3','3.1','3.2','3.3','3.4','3.5','3.6','4.1','4.2','5.1','5.2','5.3','6.1','6.2','6.3','6.4'];
let flag = 0;
while (1) {
    waitForActivity(
        "com.moocxuetang.ui.LearnPlanActivity",
        [(period = 200)]
    );
    let course_name = course_str[flag];
    textContains(course_name).waitFor();
    textContains(course_name).findOne().parent().parent().parent().click();
    sleep(2000);
    back();
    let count_down = 600;
    while (count_down >= 0) {
        if (count_down % 5 == 0) {
            toast("time left:" + count_down);
        }
        count_down -= 1;
        sleep(1000);
    }
    flag += 1;
}
