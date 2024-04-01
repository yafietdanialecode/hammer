
// Exception Checker
export default class EC {

    // Not Exception 🔽
    static ne (id: string, exceptions: string[]) {
        // returns true if id exists in exception ids, else return false
        return exceptions.every((exceptions_id: string) => id !== exceptions_id);
    }
    
}