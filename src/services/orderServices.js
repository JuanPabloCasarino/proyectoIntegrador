import order from '../dao/models/order.model.js';

export class orderServicesDB {

    async getAllOrders() {
        const orders = await order.find();
        return orders;
    }
    async getOrderById(id) {
        const order = await order.findOne({
            _id: id
        });
        if (!order) return `No se encuentra el producto con el id ${id}`;
        return order;
    }

    async createOrder(info){
        const newOrder = await order.create(info);
        return newOrder;
    }

    async updateOrderById(id, newStatus) {
        const updatedOrder = async () => await order.updateOne({_id: id}, {$set: {status: newStatus}});
        if (!order) return `No se encuentra el producto con el id ${id}`;
        return updatedOrder;
    }
}