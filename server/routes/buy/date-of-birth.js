const handlers = {
  get: function (request, reply) {
    return reply.view('date-of-birth', {
      pageTitle: 'What\'s your date of birth?',
      errorMessage: 'Enter a valid date of birth',
      exampleDate: '23 3 1972',
      birthDay: request.session.birthDay,
      birthMonth: request.session.birthMonth,
      birthYear: request.session.birthYear
    })
  },
  post: function (request, reply) {
    request.session.birthDay = request.payload.birthDay
    request.session.birthMonth = request.payload.birthMonth
    request.session.birthYear = request.payload.birthYear
    // Combile address
    //request.session.dateOfBirth = request.session.birthDay + " " + request.session.birthMonth + " " + request.session.birthYear

    var date = new Date(Date.UTC(request.session.birthYear, request.session.birthMonth -1, request.session.birthDay));
    var options = {
        weekday: "long", year: "numeric", month: "short", day: "numeric"
    };
    request.session.dateOfBirth = date.toLocaleDateString("en-us", options)
    var year = request.payload.birthYear
    returnURL = request.query.returnUrl

    if (request.session.licenceType === 'Trout and coarse') {
      if (request.session.licenceLength === '1 day') {
        request.session.cost = "£3.75"
      } else {
        request.session.cost = "£10.00"
      }
    } else {
      if (request.session.licenceLength === '1 day') {
        request.session.cost = "£8.00"
      } else {
        request.session.cost = "£23.00"
      }
    }

    if (year >= 2004) {
      // 12 or younger - No license needed
      return reply.redirect('no-licence-required')
    } else  if (year >= 2000 && year < 2004){
      // 12 to 16 - Free License
      if (returnURL) {
        request.session.cost = "0"
        return reply.redirect(returnURL)
      } else {
        request.session.cost = "Free"
        return reply.redirect('name')
      }
    } else {
      if (returnURL) {
        return reply.redirect(returnURL)
      } else {
        return reply.redirect('name')
      }
    }
  }
}


module.exports = [{
  method: 'GET',
  path: '/buy/date-of-birth',
  config: {
    handler: handlers.get
  }
},
{
  method: 'POST',
  path: '/buy/date-of-birth',
  config: {
    handler: handlers.post
  }
}]
