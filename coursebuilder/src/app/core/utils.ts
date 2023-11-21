export class LocalStorageUtils {
  /**
   * Saves data to localStorage.
   * @param key - Key for the data to be saved.
   * @param data - Data to be saved.
   */
  static saveToLocalStorage(key: string, data: any): void {
    try {
      const stringifiedData = JSON.stringify(data);
      localStorage.setItem(key, stringifiedData);
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  }

  /**
   * Retrieves data from localStorage.
   * @param key - Key for the data to be retrieved.
   * @returns - Retrieved data or null if not found.
   */
  static retrieveFromLocalStorage(key: string): any {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error retrieving from local storage:", error);
      return null;
    }
  }

  /**
   * Deletes data from localStorage.
   * @param key - Key for the data to be deleted.
   */
  static deleteFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clears all data from localStorage.
   */
  static clearLocalStorage(): void {
    localStorage.clear();
  }

  static updateLocalStorageProperty(
    key: string,
    property: string,
    value: any,
  ): void {
    try {
      const existingData =
        LocalStorageUtils.retrieveFromLocalStorage(key) || {};
      existingData[property] = value;
      LocalStorageUtils.saveToLocalStorage(key, existingData);
    } catch (error) {
      console.error("Error updating property in local storage:", error);
    }
  }
  static generateCourseId(): number {
    try {
      const courses =
        LocalStorageUtils.retrieveFromLocalStorage("courses") || [];
      if (courses && courses.length > 0) {
        const lastCourse = courses[courses.length - 1];
        return Number(lastCourse.id) + 1;
      } else {
        return 1;
      }
    } catch (error) {
      return 0;
    }
  }
}

export class CommonUtils {
  static getBase64(file: any): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
}
