//TransCode
const PipelineId = '1514662106657-sqdrmv'
const PresetId = '1515188230390-9zphxu'
const watermarks = '1.jpg'

let params = {
    transCodeParam: function(file) {
        let fileNameParse = file.split('.')[0];
        let params = {
            PipelineId: PipelineId,
            OutputKeyPrefix: null,
            Input: {
                Key: file,
                FrameRate: 'auto',
                Resolution: 'auto',
                AspectRatio: 'auto',
                Interlaced: 'auto',
                Container: 'auto'
            },
            Outputs: [{
                Key: fileNameParse+'.mp4',
                ThumbnailPattern: fileNameParse + '-{count}',
                PresetId: PresetId,
                Watermarks: [{
                    InputKey: watermarks,
                    PresetWatermarkId: 'BottomRight'
                }],
            }]
        };

        return params;
    }
};

module.exports = params;