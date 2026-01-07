function wait(seconds){
    return new Promise(resolve => setTimeout(resolve, 1000 * seconds))
}

async function testAwait1(){
    console.log("about to wait")
    await wait(5)
    console.log("finished the 5 second wait")
}

testAwait1()

async function testAwait2(){
    console.log("test 2 about to wait")
    await wait(3)
    console.log("test 2 finished the 3 second wait")
}

testAwait2()