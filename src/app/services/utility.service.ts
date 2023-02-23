import { Injectable } from '@angular/core';
import { SharingService } from './sharing.service';
import { ClarificationService } from './clarification.service';
import { NotificationService } from './notification.service';

@Injectable()
export class UtilityService {
    clarificationList: any[] = [];

    constructor(
        private sharingService: SharingService,
        private clarificationService: ClarificationService,
        private notifyService: NotificationService) { }

    async getClarificationListData() {
        this.clarificationList = [];
        await this.clarificationService.getClarificationList()
            .then((response) => {
                if (response?.status === 'success' && response?.data?.clarificationList?.length > 0) {
                    const clarificationList = response.data.clarificationList;
                    clarificationList.forEach(element => {
                        if (element && element['_id']) {
                            const menuItemObj = {
                                menuId: element['_id'],
                                menuTitle: element.title,
                            }
                            this.clarificationList.push(menuItemObj);
                        }
                    });
                }
            });
        return this.clarificationList;
    }

    getSelectedClarificationData(clarificationId) {
        let conversationArray = [];
        this.clarificationService.getSelectedClarification(clarificationId)
            .then((data) => {
                if (data?.status === 'success' && data?.clarificationData?.conversation?.length > 0) {
                    conversationArray = data.clarificationData.conversations;
                }
            });
        this.sharingService.setSelectedClarificationConversation(conversationArray);
    }

    editExistingclarificationData(clarificationId: string, title: string) {
        this.clarificationService.updateClarificationTitle(clarificationId, title)
            .then((res) => {
                this.notifyService.showSuccess("Clarification title modified successfully !!",
                    "Notification");
            })
            .catch((err) => {
                this.notifyService.showError("Error Occured while modifiying the clarification title !!",
                    "Notification");
                console.log('err', err);
            });
    }

    deleteExistingclarificationData(clarificationId: string) {
        this.clarificationService.deleteClarification(clarificationId)
            .then((res) => {
                this.notifyService.showSuccess("Clarification Deleted successfully !!",
                    "Notification");
            })
            .catch((err) => {
                this.notifyService.showError("Error Occured while deleting the Clarification !!",
                    "Notification");
                console.log('err', err);
            });
    }
}