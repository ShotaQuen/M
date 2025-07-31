const axios = required('axios')
async function vccgenerator(type, num = 10) {
    try {
        const _type = {
            'american-express': 'American Express',
            mastercard: 'MasterCard',
            visa: 'Visa',
            jcb: 'JCB'
        }
        
        if (!Object.keys(_type).includes(type.toLowerCase())) throw new Error(`Available types: ${Object.keys(_type).join(', ')}`);
        if (isNaN(num)) throw new Error('Invalid number');
        
        const { data } = await axios.get('https://backend.lambdatest.com/api/dev-tools/credit-card-generator', {
            headers: {
                'content-type': 'application/json'
            },
            params: {
                type: _type[type.toLowerCase()],
                'no-of-cards': num
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = function(app) {
    app.get('/tools/vcc', async (req, res) => {
        try {
            const { type, num } = req.query;
            if (!type && !num) {
                return res.status(400).json({ status: false, error: 'Parameter nya wajib di isi' });
            }
            const { result } = await vccgenerator(type, num);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};