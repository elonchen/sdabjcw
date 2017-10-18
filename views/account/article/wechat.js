'use strict'
var wechatAPP = require('./sendWechat');
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
                var usernames = [];
                result.readers.forEach(function(reader){
                    if(!reader.isFinished){
                        usernames.push(reader.username);
                    }
                });
                var url = "http://sdabj.com/account/article/unread/";
                usernames = usernames.join('|');
                console.log(usernames);
                wechatAPP.sendWechatUnread(usernames,"您有新的阅签通知",result.title,url,1000007);
                req.flash('success','微信通知了未签到的人员');
                res.location('/account/article/manage/');
                res.redirect('/account/article/manage/');
            }
        });
}