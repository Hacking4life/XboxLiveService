const Smartglass = require('xbox-smartglass-core-node')
var SystemInputChannel = require('xbox-smartglass-core-node/src/channels/systeminput');
var deviceStatus = {
    current_app: false,
    connection_status: false,
    client: false
  }


  module.exports = {

    async getAvailableConsoles()
    {
      var sgClient =  Smartglass();
      return await sgClient.discovery();
    },
    
    async poweroff(ip)
    {  var sgClient =  Smartglass();
      sgClient.connect(ip).then(function()
      {
        setTimeout(function(){
          sgClient.powerOff().then(function(status){
          }, function(error){
             
          })
      }.bind(sgClient), 1000)
    }, function(error){  
      })
    },

    async connect(ip)
    {
        var sgClient =  Smartglass();
        sgClient.connect(ip).then(function(){
            console.log("connected");
      }, function(error){
          console.log(error)
        })
    },

    async buttonclick(ip , button)
    { console.log("Buttonclick");
        var sgClient =  Smartglass();
        sgClient.connect(ip).then(function(){
            console.log("Connected");
          sgClient.addManager('system_input', SystemInputChannel())
          setTimeout(function(){
            sgClient.getManager('system_input').sendCommand(button).then(function(){
                console.log("clicked");
                
            }, function(error){       
                console.log(error)
            });
        }.bind(deviceStatus), 1000)
      }, function(error){
          console.log(error)
        })
    }
  };