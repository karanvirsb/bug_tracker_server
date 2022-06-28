import TicketService from "./ticket_service";
import { Tickets, ticketType } from "../../Model/Tickets";
// const sinon = require("sinon");
export {};
const mongoose = require("mongoose");
const mongodb = "mongodb://localhost:27017/bugTracker_serviceTest";
mongoose.connect(mongodb);

describe("TicketService tests", () => {
    beforeAll(async () => {
        await Tickets.remove({});
    });

    afterAll(async () => {
        await Tickets.remove({});
        await mongoose.disconnect();
    });

    it("has been defined", () => {
        expect(TicketService).toBeDefined();
        expect(Tickets).toBeDefined();
    });

    const ticketData: ticketType[] = [
        {
            ticketId: "1",
            title: "Bugs",
            description: "fix",
            time: 1,
            ticketStatus: "Open",
            ticketSeverity: "Medium",
            ticketType: "Bug",
            reporterId: "1",
            projectId: "1",
        },
    ];

    test("create ticket", async () => {
        const ticketService = TicketService(Tickets);
        const createdTicket = await ticketService.createTicket(ticketData[0]);
        const expectedTicket = ticketData[0];
        const actualTicket = createdTicket;

        expect(actualTicket).toMatchObject(expectedTicket);
    });

    test("update ticket", async () => {
        const ticketService = TicketService(Tickets);
        const updatedTicket = await ticketService.updateTicket(
            ticketData[0].ticketId,
            {
                ticketStatus: "Processing",
            }
        );

        expect(updatedTicket).toBe(true);
    });

    test("Getting ticket", async () => {
        const ticketService = TicketService(Tickets);
        const foundTicket = await ticketService.getTicket({
            filter: "ticketId",
            val: ticketData[0].ticketId,
        });

        expect(foundTicket.ticketStatus).toBe("Processing");
    });

    test("Assigning dev to ticket", async () => {
        const ticketService = TicketService(Tickets);
        const updatedTicket = await ticketService.assignUserToTicket(
            ticketData[0].ticketId,
            "2"
        );

        expect(updatedTicket).toBe(true);
    });

    test("Remove assigned dev from ticket", async () => {
        const ticketService = TicketService(Tickets);
        const updatedTicket = await ticketService.removeUserFromTicket(
            ticketData[0].ticketId,
            "2"
        );

        expect(updatedTicket).toBe(true);
    });

    test("Getting stats", async () => {
        const ticketService = TicketService(Tickets);
        const ticketsArr = await ticketService.getStatistics(["1"]);

        expect(ticketsArr[0].ticketSeverity).toBe("Medium");
        expect(ticketsArr[0].ticketStatus).toBe("Processing");
    });

    test("deleting ticket", async () => {
        const ticketService = TicketService(Tickets);
        const deletedTicket = await ticketService.deleteTicket(
            ticketData[0].ticketId
        );

        expect(deletedTicket).toBe(true);
    });
});
