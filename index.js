var Service, Characteristic;
var request = require("request");

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-http-jeedom", "HttpJeedom", HttpJeedomAccessory);
}

function HttpJeedomAccessory(log, config) {
    this.log = log;
    this.jeedom_url = config["jeedom_url"];
    this.jeedom_api = config["jeedom_api"];
    this.service = config["service"];
    this.name = config["name"];
    // SwitchService, OutletService, FanService
    this.onCommandID = config["onCommandID"];
    this.offCommandID = config["offCommandID"];
    this.stateCommandID = config["stateCommandID"];
    // LightbulbService
    this.levelCommandID = config["levelCommandID"];
    // TemperatureService
    this.temperatureCommandID = config["temperatureCommandID"];
    // HumidityService
    this.humidityCommandID = config["humidityCommandID"];
    // ShutterService
    this.upCommandID = config["upCommandID"];
    this.downCommandID = config["downCommandID"];
    this.stateCommandID = config["stateCommandID"];
    // AmbientLightService
    this.ambientLightCommandID = config["ambientLightCommandID"];
    // GarageDoorOpenerService
    this.openGarageDoorCommandID = config["openGarageDoorCommandID"];
    this.closeGarageDoorCommandID = config["closeGarageDoorCommandID"];
    this.stateGarageDoorCommandID = config["stateGarageDoorCommandID"];
    // CarbonMonoxideSensorService, CarbonDioxideSensorService, ContactSensorService, MotionSensorService, LeakSensorService, OccupancySensorService, SmokeSensorService
    this.sensorCommandID = config["sensorCommandID"];
    //LockService
    this.lockCommandID = config["lockCommandID"];
    this.unlockCommandID = config["unlockCommandID"];
}

HttpJeedomAccessory.prototype = {
    httpRequest: function (url, callback) {
        request({
                url: url,
                method: "GET",
                rejectUnauthorized: false
            },
            function (error, response, body) {
                callback(error, response, body)
            })
    },

    //This function builds the URL.
    setUrl: function (cmdID, slider, color) {
        var url = this.jeedom_url + "/core/api/jeeApi.php?apikey=" + this.jeedom_api + "&type=cmd&id=" + cmdID;
        if (slider != null){
            url += "&slider=" +slider;
        }
        if (color != null){
            url += "&color=" +color;
        }     
        return url;

    },

    //This function turns On or Off a switch device
    setPowerState: function (powerOn, callback) {
        if (!this.onCommandID || !this.offCommandID) {
            this.log.warn("No command ID defined, please check config.json file");
            callback(new Error("No command ID defined"));
            return;
        }
        var url;
        if (powerOn) {
            url = this.setUrl(this.onCommandID, null, null);
        } else {
            url = this.setUrl(this.offCommandID, null, null);
        }
        this.httpRequest(url, function (error, response, responseBody) {
            if (error) {
                this.log("HTTP set power failed with error: %s", error.message);
                callback(error);
            } else {
                this.log("HTTP set power succeeded");
                callback();
            }
        }.bind(this));
    },

    //This function get a switch state
    getPowerState: function (callback) {
        if (!this.stateCommandID) {
            this.log.warn("No state command ID defined");
            callback(new Error("No status command ID defined"));
            return;
        }
        var url = this.setUrl(this.stateCommandID, null, null);
        this.httpRequest(url, function (error, response, responseBody) {
            if (error) {
                this.log("HTTP get power function failed: %s", error.message);
                callback(error);
            } else {
                var binaryState = parseInt(responseBody);
                var powerOn = binaryState > 0;
                this.log("Power state is currently %s", binaryState);
                callback(null, powerOn);
            }
        }.bind(this));
    },

    //This function changes hue of a Light bulb
    setHue: function(hue, callback) {
        var url = this.control_url + hue;
        this.log("Setting value to %s", hue);
        if (!this.hueCommandID) {
            this.log.warn("No command ID defined, please check config.json file");
            callback(new Error("No command ID defined"));
            return;
        }
        var url = this.setUrl(this.hueCommandID, null, hue);
        this.httpRequest(url, function (error, response, responseBody) {
            if (error) {
                this.log("HTTP set hue failed with error: %s", error.message);
                callback(error);
            } else {
                this.log("HTTP set hue succeeded");
                callback();
            }
        }.bind(this));
    },

    //This function get the hue from a Light bulb
    getHue: function (callback) {
        if (!this.stateCommandID) {
            this.log.warn("No state command ID defined");
            callback(new Error("No status command ID defined"));
            return;
        }
        var url = this.setUrl(this.stateCommandID, null, null);
        this.httpRequest(url, function (error, response, responseBody) {
            if (error) {
                this.log("HTTP get power function failed: %s", error.message);
                callback(error);
            } else {
                var hue = parseInt(responseBody);
                this.log("Hue is currently %s %", hue);
                if(hue == 99){
                    hue = 100;
                }
                callback(null, hue);
            }
        }.bind(this));
    },
    
    //This function changes level of a Light bulb
    setLevel: function(level, callback) {
        var url = this.control_url + level;
        this.log("Setting value to %s", level);
        if (!this.levelCommandID) {
            this.log.warn("No command ID defined, please check config.json file");
            callback(new Error("No command ID defined"));
            return;
        }
        var url = this.setUrl(this.levelCommandID, level, null);
        this.httpRequest(url, function (error, response, responseBody) {
            if (error) {
                this.log("HTTP set level failed with error: %s", error.message);
                callback(error);
            } else {
                this.log("HTTP set level succeeded");
                callback();
            }
        }.bind(this));
    },

    //This function get a level from a Light bulb
    getLevel: function (callback) {
        if (!this.stateCommandID) {
            this.log.warn("No state command ID defined");
            callback(new Error("No status command ID defined"));
            return;
        }
        var url = this.setUrl(this.stateCommandID, null, null);
        this.httpRequest(url, function (error, response, responseBody) {
            if (error) {
                this.log("HTTP get power function failed: %s", error.message);
                callback(error);
            } else {
                var level = parseInt(responseBody);
                this.log("Level is currently %s %", level);
                if(level == 99){
                    level = 100;
                }
                callback(null, level);
            }
        }.bind(this));
    },

    //This function get a temperature measurement
    getTemperature: function (callback) {
        if (!this.temperatureCommandID) {
            this.log.warn("No temperature command ID defined");
            callback(new Error("No temperature command ID defined"));
            return;
        }
        var url = this.setUrl(this.temperatureCommandID, null, null);
        this.log("Getting current temperature for sensor " + this.name);
        this.httpRequest(url, function (error, response, responseBody) {
            if (error) {
                this.log("HTTP get temperature function failed: %s", error.message);
                callback(error);
            } else {
                var floatState = parseFloat(responseBody);
                this.log("Temperature for sensor " + this.name + " is currently %s", floatState);
                callback(null, floatState);
            }
        }.bind(this));
    },

    //This function get a humidity measurement
    getHumidity: function (callback) {
        if (!this.humidityCommandID) {
            this.log.warn("No humidity command ID defined");
            callback(new Error("No humidity command ID defined"));
            return;
        }
        var url = this.setUrl(this.humidityCommandID, null, null);
        this.log("Getting current humidity for sensor " + this.name);
        this.httpRequest(url, function (error, response, responseBody) {
            if (error) {
                this.log("HTTP get humidity function failed: %s", error.message);
                callback(error);
            } else {
                var floatState = parseFloat(responseBody);
                this.log("Humidity for sensor " + this.name + " is currently %s", floatState);
                callback(null, floatState);
            }
        }.bind(this));
    },

    //This function moves Up or Down a shutter device
    setShutterState: function (shutterUp, callback) {
        if (!this.upCommandID || !this.downCommandID) {
            this.log.warn("No command ID defined, please check config.json file");
            callback(new Error("No command ID defined"));
            return;
        }
        var url;
        if (shutterUp) {
            url = this.setUrl(this.upCommandID, null, null);
        } else {
            url = this.setUrl(this.downCommandID, null, null);
        }
        this.httpRequest(url, function (error, response, responseBody) {
            if (error) {
                this.log("HTTP set shutter up failed with error: %s", error.message);
                callback(error);
            } else {
                this.log("HTTP rise shutter succeeded");
                callback();
            }
        }.bind(this));
    },

    //This function get a shutter state
    getShutterState: function (callback) {
        if (!this.stateCommandID) {
            this.log.warn("No state command ID defined");
            callback(new Error("No status command ID defined"));
            return;
        }
        var url = this.setUrl(this.stateCommandID, null, null);
        this.httpRequest(url, function (error, response, responseBody) {
            if (error) {
                this.log("HTTP get shutter state function failed: %s", error.message);
                callback(error);
            } else {
                var binaryState = parseInt(responseBody);
                var shutterUp = binaryState > 0;
                this.log("Shutter state is currently %s", binaryState);
                callback(null, shutterUp);
            }
        }.bind(this));
    },

    getAmbientLight: function(callback) {
        if (!this.ambientLightCommandID) {
            this.log.warn("No ambient light command ID defined");
            callback(new Error("No ambient light command ID defined"));
            return;
        }
        var url = this.setUrl(this.ambientLightCommandID, null, null);
        this.log("Getting current ambient light for sensor " + this.name );
        this.httpRequest(url, function(error, response, responseBody) {
            if (error) {
                this.log("HTTP get ambient light function failed: %s", error.message);
                callback(error);
            } else {
                var floatState = parseFloat(responseBody);
                this.log("Ambient light for sensor " + this.name + " is currently %s", floatState);
                callback(null, floatState);
            }
        }.bind(this));
    },

    getCurrentDoorState: function(callback) {
        if (!this.stateGarageDoorCommandID) {
            this.log.warn("No garage door state command ID defined");
            callback(new Error("No garage door state command ID defined"));
            return;
        }
        var url = this.setUrl(this.stateGarageDoorCommandID, null, null);
        this.log("Getting current garage door state " + this.name );
        this.httpRequest(url, function(error, response, responseBody) {
            if (error) {
                this.log("HTTP get garage door state function failed: %s", error.message);
                callback(error);
            } else {
                var garageDoorStatus = parseInt(responseBody);
                var textState = "";
                switch (garageDoorStatus) {
                    case 0: textState = "Closed"; break;
                    case 252: textState = "Closing"; break;
                    case 253: textState = "Stopped"; break;
                    case 254: textState = "Opening"; break;
                    case 255: textState = "Opened"; break;
                    default: this.log("Unhandled CurrentDoorState");
                }
                this.log("Garage door state for " + this.name + " is currently %s", textState);
                callback(null, garageDoorStatus);
            }
        }.bind(this));
    },

    setTargetDoorState: function(value, callback) {
        if (!this.openGarageDoorCommandID || !this.closeGarageDoorCommandID) {
            this.log.warn("No command ID defined, please check config.json file");
            callback(new Error("No command ID defined"));
            return;
        }
        var url;
        if(value === Characteristic.TargetDoorState.OPEN) {
            url = this.setUrl(this.openGarageDoorCommandID, null, null);
        } else {
            url = this.setUrl(this.closeGarageDoorCommandID, null, null);
        }
        this.httpRequest(url, function (error, response, responseBody) {
            if (error) {
                this.log("HTTP set shutter up failed with error: %s", error.message);
                callback(error);
            } else {
                this.log("HTTP rise shutter succeeded");
                callback();
            }
        }.bind(this));
    },

    getBinarySensorState: function (callback) {
        if (!this.sensorCommandID) {
            this.log.warn("No sensor command ID defined");
            callback(new Error("No sensor command ID defined"));
            return;
        }
        var url = this.setUrl(this.sensorCommandID, null, null);
        this.httpRequest(url, function (error, response, responseBody) {
            if (error) {
                this.log("HTTP get binary sensor state function failed: %s", error.message);
                callback(error);
            } else {
                var level = parseInt(responseBody);
                var isTrue = level > 0;
                this.log("Binary sensor state is currently %s", level);
                callback(null, isTrue);
            }
        }.bind(this));
    },

    getLockCurrentState: function(callback) {
        if (!this.stateCommandID) {
            this.log.warn("No state command ID defined");
            callback(new Error("No state command ID defined"));
            return;
        }
        var url = this.setUrl(this.stateCommandID, null, null);
        this.httpRequest(url, function (error, response, responseBody) {
            if (error) {
                this.log("HTTP get binary sensor state function failed: %s", error.message);
                callback(error);
            } else {
                var level = parseInt(responseBody);
                this.log("Lock state is currently %s", level);
                callback(null, level);
            }
        }.bind(this));
    },

    setLockTargetState: function(state, callback) {
        if (!this.lockCommandID || !this.unlockCommandID) {
            this.log.warn("No command ID defined, please check config.json file");
            callback(new Error("No command ID defined"));
            return;
        }
        var url;
        if (state) {
            url = this.setUrl(this.lockCommandID, null, null);
        } else {
            url = this.setUrl(this.unlockCommandID, null, null);
        }
        this.httpRequest(url, function (error, response, responseBody) {
            if (error) {
                this.log("HTTP set door lock up failed with error: %s", error.message);
                callback(error);
            } else {
                this.log("HTTP rise shutter succeeded");
                callback();
            }
        }.bind(this));
    },

    identify: function (callback) {
        this.log("Identify requested");
        callback();
    },

    getServices: function () {
        // you can OPTIONALLY create an information service if you wish to override
        // the default values for things like serial number, model, etc.
        var informationService = new Service.AccessoryInformation();
        informationService
            .setCharacteristic(Characteristic.Manufacturer, "HTTP Manufacturer")
            .setCharacteristic(Characteristic.Model, "HTTP Model")
            .setCharacteristic(Characteristic.SerialNumber, "HTTP Serial Number");

        switch(this.service) {
            case "SwitchService": {
                this.log("Defining a switch module");
                var switchService = new Service.Switch(this.name);
                switchService
                    .getCharacteristic(Characteristic.On)
                    .on('get', this.getPowerState.bind(this))
                    .on('set', this.setPowerState.bind(this));
                return [switchService];
                break;
            }
            case "FanService": {
                this.log("Defining a fan module");
                var fanService = new Service.Fan(this.name);
                fanService
                    .getCharacteristic(Characteristic.On)
                    .on('set', this.setPowerState.bind(this))
                    .on('get', this.getPowerState.bind(this));
                return [fanService];
                break;
            }
            case "OutletService": {
                this.log("Defining a outlet module");
                var outletService = new Service.Outlet(this.name);
                outletService
                    .getCharacteristic(Characteristic.On)
                    .on('set', this.setPowerState.bind(this))
                    .on('get', this.getPowerState.bind(this));
                return [outletService];
                break;
            }
            case "LightbulbService": {
                this.log("Defining a lightbulb module");
                var lightbulbService = new Service.Lightbulb(this.name);
                lightbulbService
                    .getCharacteristic(Characteristic.On)
                    .on('set', this.setPowerState.bind(this))
                    .on('get', this.getPowerState.bind(this));

                if(this.service.can_dim == null || this.service.can_dim == true ) {
                    lightbulbService
                        .addCharacteristic(new Characteristic.Brightness())
                        .on('set', this.setLevel.bind(this))
                        .on('get', this.getLevel.bind(this));
                }
                return [lightbulbService];
                break;
            }
            case "TemperatureService": {
                this.log("Defining a temperature sensor");
                var temperatureService = new Service.TemperatureSensor(this.name);
                temperatureService
                    .getCharacteristic(Characteristic.CurrentTemperature)
                    .on('get', this.getTemperature.bind(this));
                return [informationService, temperatureService];
                break;
            }
            case "HumidityService": {
                this.log("Defining a humidity sensor");
                var humidityService = new Service.HumiditySensor(this.name);
                humidityService
                    .getCharacteristic(Characteristic.CurrentRelativeHumidity)
                    .on('get', this.getHumidity.bind(this));
                return [informationService, humidityService];
                break;
            }
            case "AmbientLightService": {
                this.log("Defining a light sensor");
                var ambientLightService = new Service.LightSensor(this.name);
                ambientLightService
                    .getCharacteristic(Characteristic.CurrentAmbientLightLevel)
                    .on('get', this.getAmbientLight.bind(this));
                return [informationService, ambientLightService];
                break;
            }
            case "ShutterService": {
                this.log("Defining a window covering module");
                var windowCoveringService = new Service.WindowCovering(this.name);
                windowCoveringService
                    .getCharacteristic(Characteristic.CurrentPosition)
                    .on('get', this.getShutterState.bind(this));
                windowCoveringService
                    .getCharacteristic(Characteristic.TargetPosition)
                    .on('set', this.setShutterState.bind(this));
                return [windowCoveringService];
                break;
            }
            case "GarageDoorOpenerService": {
                this.log("Defining a garage door opener");
                var garageDoorOpenerService = new Service.GarageDoorOpener(this.name);
                garageDoorOpenerService
                    .getCharacteristic(Characteristic.CurrentDoorState)
                    .on('get', this.getCurrentDoorState.bind(this));
                garageDoorOpenerService
                    .getCharacteristic(Characteristic.TargetDoorState)
                    .on('set', this.setTargetDoorState.bind(this));
                return [garageDoorOpenerService];
                break;
            }
            case "CarbonMonoxideSensorService": {
                var carbonMonoxideSensorService = new Service.CarbonMonoxideSensor(this.name);
                carbonMonoxideSensorService
                    .getCharacteristic(Characteristic.CarbonMonoxideDetected)
                    .on('get', this.getBinarySensorState.bind(this));
                return [informationService, carbonMonoxideSensorService];
                break;
            }
            case "CarbonDioxideSensorService": {
                var carbonDioxideSensorService = new Service.CarbonDioxideSensor(this.name);
                carbonDioxideSensorService
                    .getCharacteristic(Characteristic.CarbonDioxideDetected)
                    .on('get', this.getBinarySensorState.bind(this));
                return [informationService, carbonDioxideSensorService];
                break;
            }
            case "ContactSensorService": {
                var contactSensorService = new Service.ContactSensor(this.name);
                contactSensorService
                    .getCharacteristic(Characteristic.ContactSensorState)
                    .on('get', this.getBinarySensorState.bind(this));
                return [informationService, contactSensorService];
                break;
            }
            case "MotionSensorService": {
                var motionSensorService = new Service.MotionSensor(this.name);
                motionSensorService
                    .getCharacteristic(Characteristic.MotionDetected)
                    .on('get', this.getBinarySensorState.bind(this));
                return [informationService, motionSensorService];
                break;
            }
            case "LeakSensorService": {
                var leakSensorService = new Service.LeakSensor(this.name);
                leakSensorService
                    .getCharacteristic(Characteristic.LeakDetected)
                    .on('get', this.getBinarySensorState.bind(this));
                return [informationService, leakSensorService];
                break;
            }
            case "OccupancySensorService": {
                var occupancySensorService = new Service.OccupancySensor(this.name);
                occupancySensorService
                    .getCharacteristic(Characteristic.OccupancyDetected)
                    .on('get', this.getBinarySensorState.bind(this));
                return [informationService, occupancySensorService];
                break;
            }
            case "SmokeSensorService": {
                var smokeSensorService = new Service.SmokeSensor(this.name);
                smokeSensorService
                    .getCharacteristic(Characteristic.SmokeDetected)
                    .on('get', this.getBinarySensorState.bind(this));
                return [informationService, smokeSensorService];
                break;
            }
            case "LockService":{
                var lockService = new Service.LockMechanism(this.name);
                lockService
                    .getCharacteristic(Characteristic.LockCurrentState)
                    .on('get', this.getLockCurrentState.bind(this));
                lockService
                    .getCharacteristic(Characteristic.LockTargetState)
                    .on('set', this.setLockTargetState.bind(this));
                return [lockService];
                break;
            }
        }
    }
}
