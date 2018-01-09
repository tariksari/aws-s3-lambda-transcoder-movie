const AWS = require('aws-sdk');
const async = require('async');
const axios = require('axios');
let _params = require('./params')

const CRETA_VIDEO_API = 'http://api.example.com/api/video'
const bucket = 'new-upload-bucket';

const eltr = new AWS.ElasticTranscoder({
    apiVersion: '2012-09-25',
    region: 'eu-west-1'
});

const s3 = new AWS.S3({
    apiVersion: '2012-09-25'
});

exports.s3Handler = function(key) {
    async.waterfall([
        //Get Movie MetaData
        function getMeta(next) {
            s3.headObject({ Bucket: bucket, Key: key }, function(err, s3Data) {
                next(err, s3Data['Metadata']);
            })
        },
        //Create new Video
        function createNewMovie(meta, next) {
            let splitKey = key.split('.')[0]
            //Post Parametres
            let postParams = {
                title: meta.video_name,
                category_id: meta.video_category,
                video_path: splitKey,
                image_path: splitKey + '--0001.png'
            };

            axios({
                method: 'POST',
                url: CRETA_VIDEO_API,
                data: postParams,
             //   headers: { 'Authorization': 'Bearer ' + meta.token }, //Api User login jwt
            }).then(function(reponse) {
                next(null, reponse);
            }).catch(function(err) {
                next(err, null);
            });
        },
        //Start TransCodeJob
        function transcoderNewJob(s3File, next) {
            eltr.createJob(_params.transCodeParam(key), function(err, data) {
                next(err, data);
            });
        }
    ], function(err) {
        console.log(err);
        //if (err) throw err;
    });
}
exports.handler = function(event, context, callback) {

    let key = event["Records"][0]["s3"]["object"]["key"];
    //Action
    exports.s3Handler(key, context);
}
