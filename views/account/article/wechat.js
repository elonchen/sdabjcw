'use strict'
var wechatAPP = require('./sendWechat');
var usernames = [];
var persons = [];
//wechatAPP.sendWechat(result.applicantSupervisor.username,"您有一条新的假条需要审批",general,"http://sdabj.com/account/agree/",1000003);
exports.info = function(req, res, next){
    console.log(req.params.id);
    console.log("send wechat notifications");
        req.app.db.models.Article.findById(req.params.id).exec(function(err, result) {
            if (err) {
                return next(err);
            }
            if (req.xhr) {
                res.send(article);
            }else {
                console.log("test");
                

                req.query.search = req.query.search ? req.query.search : '';
                req.query.status = req.query.status ? req.query.status : '';
                req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 100;
                req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
                req.query.sort = req.query.sort ? req.query.sort : '-_id';
                var filters = {};
                if (req.query.search) {
                filters.search = new RegExp('^.*?'+ req.query.search +'.*$', 'i');
                }
                if (req.query.status) {
                filters['status.id'] = req.query.status;
                }
        
                req.app.db.models.Account.pagedFind({
                    filters: filters,
                    keys: 'user name company phone zip',
                    limit: req.query.limit,
                    page: req.query.page,
                    sort: req.query.sort
                }, function(err, results) {
                    if (err) {
                        return callback(err, null);
                    }
                    persons = results.data;;
                    console.log(persons);
                    result.readers.forEach(function(reader){//这里需要修改，企业威信的id为自定义的zip
                        if(!reader.isFinished){
                            persons.forEach(function(person) {
                                if(person.phone == reader.username){
                                    usernames.push(person.zip);
                                    console.log(person.zip);
                                }
                            }, this);
                            
                        }
                    });
                    var url = "http://sdabj.com:3000/account/article/unread/";
                    usernames = usernames.join('|');
                    console.log(usernames);
                    wechatAPP.sendWechatUnread(usernames,"您有新的阅签通知",result.title,url,1000003);
                    req.flash('success','微信通知了未签到的人员');
                    res.location('/account/article/manage/');
                    res.redirect('/account/article/manage/');
                });

                
            }
        });
}