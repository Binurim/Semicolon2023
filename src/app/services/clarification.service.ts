import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable()
export class ClarificationService {

  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  public getClarificationList(): Promise<any> {
    const url = 'http://localhost:3100/api/clarification';
    return this.http
      .get(url)
      .toPromise()
      .then((res) => (res ? res : null))
      .catch((error) => {
        this.handleAndLogError(error);
        return error;
      });
  }

  public getSelectedClarification(clarificationId: string) {
    const url = `http://localhost:3100/api/clarification/${clarificationId}`;
    return this.http
      .get(url, this.options)
      .toPromise()
      .then((res) => (res ? res : null))
      .catch((error) => {
        this.handleAndLogError(error);
        return error;
      });
  }

  public createNewClarification(data: any, limit: number = 20, offset: number = 1) {
    const url = 'http://localhost:3100/api/clarification';
    const requestBody = {};
    requestBody['title'] = data['title'];
    requestBody['status'] = data['send_msg'];
    return this.http
      .post(url, JSON.stringify(requestBody), this.options)
      .toPromise()
      .then((res) => (res ? res : null))
      .catch((error) => {
        this.handleAndLogError(error);
        return error;
      });
  }

  public addFeedback(clarificationId: string, data: any, limit: number = 20, offset: number = 1) {
    const url = '';
    const requestBody = {};
    requestBody['isSatisfied'] = data['isSatisfied'];
    requestBody['feedback_msg'] = data['feedback_msg'];
    return this.http
      .patch(url, JSON.stringify(requestBody), this.options)
      .toPromise()
      .then((res) => (res ? res : null))
      .catch((error) => {
        this.handleAndLogError(error);
        return error;
      });
  }

  public updateExistingClarification(clarificationId: string, data: any, limit: number = 20, offset: number = 1) {
    const url = '';
    const requestBody = {};
    requestBody['send_msg'] = data['send_msg'];
    return this.http
      .patch(url, JSON.stringify(requestBody), this.options)
      .toPromise()
      .then((res) => (res ? res : null))
      .catch((error) => {
        this.handleAndLogError(error);
        return error;
      });
  }

  public updateClarificationTitle(clarificationId: string, data: any, limit: number = 20, offset: number = 1) {
    const url = '';
    const requestBody = {};
    requestBody['title'] = data['title'];
    return this.http
      .patch(url, JSON.stringify(requestBody), this.options)
      .toPromise()
      .then((res) => (res ? res : null))
      .catch((error) => {
        this.handleAndLogError(error);
        return error;
      });
  }


  public deleteClarification(clarificationId: string) {
    const url = '';
    return this.http
      .delete(url)
      .toPromise()
      .then((res) => (res ? res : null))
      .catch(this.handleAndLogError);
  }

  handleError(error: any): Promise<any> {
    if (error && error.error && error.error.errorMsg) {
      return Promise.reject(error);
    } else if (error && error.error && error.error.message) {
      return Promise.reject(error.error || error);
    } else {
      return Promise.reject(error.message || error);
    }
  }

  handleAndLogError(error: any): Promise<any> {
    return this.handleError(error);
  }
}