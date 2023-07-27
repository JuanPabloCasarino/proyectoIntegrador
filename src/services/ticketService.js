import ProductModel from "../dao/models/product.model.js";
import TicketModel from "../dao/models/ticket.model.js";

export class TicketServiceDB{
    async createTicket(info) {
        const newTicket = await TicketModel.create(info);
        return newTicket;
      }
}