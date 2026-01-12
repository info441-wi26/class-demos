function wait(seconds){
    return new Promise(resolve => {
        console.log("wait is starting for " + seconds + " seconds")
        setTimeout(resolve, 1000 * seconds)
    })
}

async function testAwait1(){
    console.log("test 1 about to wait")
    await wait(5)
    console.log("test 1 finished the 5 second wait")
}

async function testAwait2(){
    console.log("test 2 about to wait")
    await wait(3)
    console.log("test 2 finished the 3 second wait")
}

testAwait1()
testAwait2()

// async  function some_function() {
//     return 5;
// }

// async  function call() {
//     console.log(await some_function());
// }

// call()