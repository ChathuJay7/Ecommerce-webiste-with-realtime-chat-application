export interface ICurrentThreadData {
    id?: string
    members?: { id: string, username: string }[];
    isGroupChat?: boolean
}