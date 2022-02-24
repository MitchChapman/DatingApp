import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message.model';
import { GetPaginatedResult, GetPaginationHeaders } from './pagination-helper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  GetMessages(pageNumber, pageSize, container) {
    let params = GetPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return GetPaginatedResult<Message[]>(`${this.baseUrl}messages`, params, this.httpClient);
  }

  GetMessageThread(username: string) {
    return this.httpClient.get<Message[]>(
      `${this.baseUrl}messages/thread/${username}`
    );
  }

  SendMessage(username: string, content: string) {
    return this.httpClient.post<Message>(
      `${this.baseUrl}messages`,
      {recipientUsername: username, content}
    )
  }

  DeleteMessage(id: number) {
    return this.httpClient.delete(
      `${this.baseUrl}messages/${id}`
    )
  }
}