const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const {promisify} = require("es6-promisify");
// promisify.Promise = require("bluebird");
const Student = mongoose.model('Student');
// middlewares
exports.validateRegistration = (req,res,next) => {
    req.sanitizeBody('name');
    req.checkBody('name','provide a name').notEmpty();
    req.checkBody('email','provide a valid email').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension:false,
        gmail_remove_subaddress:false
    });
    req.checkBody('password','password cant be blank').notEmpty();
    req.checkBody('password2','password2 cant be blank').notEmpty();
    req.checkBody('password2','opps your password donnot match').equals(req.body.password);
    
    const errors = req.validationErrors();
    if(errors){
        req.flash('warning',errors.map(err => err.msg));
        res.render('register',{title: 'register',flashes: req.flash});
    }
    next();
}

// controller
exports.register = (req,res) => {
    res.render('register',{ title: 'register'});
    req.flash('success','seeeeeeseee');
}

exports.login = (req,res) => {
    res.render('login',{title: 'login'});
}

exports.createStudent =  async (req,res,next) => {
    const student = new Student({
        email:req.body.email,
        name:req.body.name,
        studentId:req.body.studentId
    });
    const register = promisify(Student.register ,Student);
    await registerAsync(student,req.body.password);
    res.send('works');
    next();
}