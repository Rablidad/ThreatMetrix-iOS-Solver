module.exports = (minDaysToReduce, maxDaysToReduce) => {
    const currentDate = new Date()
    const daysToReduce = Math.floor(Math.random() * (maxDaysToReduce - minDaysToReduce + 1)) + minDaysToReduce
    currentDate.setDate(currentDate.getDate() - daysToReduce)
    return Math.floor(currentDate.getTime() / 1000)
}