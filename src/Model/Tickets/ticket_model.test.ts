export {};
const mongoose = require("mongoose");
const mongodb = "mongodb://localhost:27017/bugTracker_test";
mongoose.connect(mongodb);
const Tickets = require("./index");

describe("Tickets Model Tests", () => {
    beforeAll(async () => {
        await Tickets.remove({});
    });

    afterEach(async () => {
        await Tickets.remove({});
    });

    afterAll(async () => {
        await Tickets.remove({});
        await mongoose.disconnect();
    });

    it("has a module", () => {
        expect(Tickets).toBeDefined();
    });

    test("create a ticket", async () => {
        const ticket = new Tickets({
            ticketId: "1",
            title: "Fix login",
            description: "Is always giving server error",
            time: 1,
            ticketStatus: "Open",
            ticketSeverity: "Medium",
            ticketType: "Issue",
            reporterId: "1",
            projectId: "1",
        });

        const savedTicket = await ticket.save();

        const expectedResult = {
            ticketId: "1",
            title: "Fix login",
            description: "Is always giving server error",
            time: 1,
            ticketStatus: "Open",
            ticketSeverity: "Medium",
            ticketType: "Issue",
            reporterId: "1",
            projectId: "1",
        };
        const actualResult = savedTicket;

        expect(actualResult).toMatchObject(expectedResult);
    });

    test("getting a ticket", async () => {
        const ticket = new Tickets({
            ticketId: "1",
            title: "Fix login",
            description: "Is always giving server error",
            time: 1,
            ticketStatus: "Open",
            ticketSeverity: "Medium",
            ticketType: "Issue",
            reporterId: "1",
            projectId: "1",
        });

        await ticket.save();
        const foundTicket = await Tickets.findOne({ ticketId: "1" });
        const expectedResult = "Fix login";
        const actualResult = foundTicket.title;

        expect(actualResult).toBe(expectedResult);
    });

    test("updating ticket", async () => {
        const ticket = new Tickets({
            ticketId: "1",
            title: "Fix login",
            description: "Is always giving server error",
            time: 1,
            ticketStatus: "Open",
            ticketSeverity: "Medium",
            ticketType: "Issue",
            reporterId: "1",
            projectId: "1",
        });

        await ticket.save();
        const updated = await Tickets.updateOne(
            { ticketId: "1" },
            { ticketStatus: "Under Review" }
        );

        const foundTicket = await Tickets.findOne({ ticketId: "1" });
        const expectedResult = "Under Review";
        const actualResult = foundTicket.ticketStatus;

        expect(actualResult).toBe(expectedResult);
        expect(updated.acknowledged).toBe(true);
    });

    test("deleting ticket", async () => {
        const ticket = new Tickets({
            ticketId: "1",
            title: "Fix login",
            description: "Is always giving server error",
            time: 1,
            ticketStatus: "Open",
            ticketSeverity: "Medium",
            ticketType: "Issue",
            reporterId: "1",
            projectId: "1",
        });

        await ticket.save();
        await Tickets.deleteOne({ ticketId: "1" });

        const foundTicket = await Tickets.findOne({ ticketId: "1" });
        const expectedResult = null;
        const actualResult = foundTicket;

        expect(actualResult).toBe(expectedResult);
    });
});
