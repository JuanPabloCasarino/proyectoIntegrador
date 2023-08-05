const isValid = async (req, res, next) =>{
    const {title, price, description, stock, code, category} = await req.body;
    console.log(title, price, description, stock, code, category);

    if( !title || !price || !description || !stock || !code || !category){
        return res.status(403).json({ error: 'Missing required information for the product' });
    }
    next();
}

export default isValid;