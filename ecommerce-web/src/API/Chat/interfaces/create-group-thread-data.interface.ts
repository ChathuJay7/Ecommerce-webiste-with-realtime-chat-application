export interface IGroupThreadData {
    threadName: string,
    members?: { id: string; username: string }[];
    groupAdminId: string
}