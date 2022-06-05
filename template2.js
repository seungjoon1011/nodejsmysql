module.exports={
    CheckTime:function(createdTime){
        var d = new Date();
        var time = Math.round(d.getTime()/1000) - createdTime;
        if(time<60){
            return `${Math.round(time)}seconds ago`;
        }else if(time<3600){
            return `${Math.round(time/60)}minutes ago`;
        }else if(time<86400){
            return `${Math.round(time/60/60)}hours ago`;
        }else if(time<2628028.8){
            return `${Math.round(time/60/60/24)}days ago`;
        }else if(time<31536345.6){
            return `${Math.round(time/60/60/24/30.417)}months ago`;
        }else{
            return `${Math.round(time/60/60/24/30.417/12)}years ago`;
        }
    },ConvertToDatefunction(createdTime){
        var date = new Date(createdTime*1000);
        return `${date.getFullYear()}년${date.getMonth()+1}월${date.getDate()}일 ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    },CheckDate(createdTime){
        var createdDate = new Date(createdTime*1000);
        var date = new Date();
        if(date.getFullYear()==createdDate.getFullYear()&&date.getMonth()==createdDate.getMonth()&&date.getDate()==createdDate.getDate()){
            return `${createdDate.getHours()} : ${createdDate.getMinutes()}`;
        }else if(createdDate.getFullYear()==date.getFullYear()){
            return `${createdDate.getMonth()+1}월 ${createdDate.getDate()}일`;
        }else{
            return `${createdDate.getFullYear()}년${createdDate.getMonth()}월${createdDate.getDate()}일`;
        }
    }
}