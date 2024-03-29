export {};
const mongoose = require("mongoose");
const mongodb = "mongodb://localhost:27017/bugTracker_test";
mongoose.connect(mongodb);
import { Tickets } from "./index";

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
        const actualResult = foundTicket?.title;

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
        const actualResult = foundTicket?.ticketStatus;

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

    test("Assign user to ticket", async () => {
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
        const assignDev: String[] = foundTicket?.assignedDev || [];
        assignDev.push("1");

        await Tickets.updateOne({ ticketId: "1" }, { assignedDev: assignDev });
        const updatedTicket = await Tickets.findOne({ ticketId: "1" });

        const expectedResult = ["1"];
        const actualResult = updatedTicket?.assignedDev;

        expect(actualResult).toStrictEqual(expectedResult);
    });

    test("remove a user from a ticket", async () => {
        const ticket = new Tickets({
            ticketId: "1",
            title: "Fix login",
            description: "Is always giving server error",
            time: 1,
            assignedDev: ["1", "2", "3"],
            ticketStatus: "Open",
            ticketSeverity: "Medium",
            ticketType: "Issue",
            reporterId: "1",
            projectId: "1",
        });

        await ticket.save();

        const foundTicket = await Tickets.findOne({ ticketId: "1" });
        const users: String[] = foundTicket?.assignedDev || [];
        const filteredUsers = users.filter((user) => user != "2");

        await Tickets.updateOne(
            { ticketId: "1" },
            { assignedDev: filteredUsers }
        );
        const updatedTicket = await Tickets.findOne({ ticketId: "1" });

        const expectedAssignedDev = ["1", "3"];
        const actualAssignedDevs = updatedTicket?.assignedDev;

        expect(actualAssignedDevs).toStrictEqual(expectedAssignedDev);
    });

    test("Get statistics", async () => {
        const ticket = new Tickets({
            ticketId: "1",
            title: "Fix login",
            description: "Is always giving server error",
            time: 1,
            assignedDev: ["1", "2", "3"],
            ticketStatus: "Open",
            ticketSeverity: "Medium",
            ticketType: "Issue",
            reporterId: "1",
            projectId: "1",
        });
        const ticket2 = new Tickets({
            ticketId: "2",
            title: "Fix login",
            description: "Is always giving server error",
            time: 1,
            assignedDev: ["1", "2", "3"],
            ticketStatus: "To be Processed",
            ticketSeverity: "Medium",
            ticketType: "Issue",
            reporterId: "1",
            projectId: "1",
        });
        const ticket3 = new Tickets({
            ticketId: "3",
            title: "Fix login",
            description: "Is always giving server error",
            time: 1,
            assignedDev: ["1", "2", "3"],
            ticketStatus: "Close",
            ticketSeverity: "Medium",
            ticketType: "Issue",
            reporterId: "1",
            projectId: "2",
        });

        await ticket.save();
        await ticket2.save();
        await ticket3.save();

        const projectIds = ["1", "2"];

        const ticketsArr: any[] = [];

        for (let i = 0; i < projectIds.length; i++) {
            const tickets = await Tickets.find(
                { projectId: projectIds[i] },
                "ticketStatus ticketSeverity ticketType projectId"
            );
            ticketsArr.push(...tickets);
        }

        const expectedTicketsArr1 = "Open";
        const actualTicketArr1 = ticketsArr[0].ticketStatus;

        expect(actualTicketArr1).toBe(expectedTicketsArr1);
        expect(ticketsArr[1].ticketStatus).toBe("To be Processed");
    });
});
