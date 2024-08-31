import { Component } from '@angular/core';
import { ItemService } from 'src/app/services/item.services';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent {
  items: any[] = [];
  newItem: any = { name: '' };

  constructor(private itemService: ItemService, private socketService: SocketService) {}

  ngOnInit(): void {
    this.loadItems();

    this.socketService.onEvent('itemAdded', (item) => {
      console.log("itemAdded called")
      this.items.push(item);
    });

    this.socketService.onEvent('itemUpdated', (updatedItem) => {
      const index = this.items.findIndex(item => item._id === updatedItem._id);
      if (index !== -1) {
        this.items[index] = updatedItem;
      }
    });

    this.socketService.onEvent('itemDeleted', (deletedItem) => {
      this.items = this.items.filter(item => item._id !== deletedItem._id);
    });
  }

  loadItems(): void {
    this.itemService.getItems().subscribe(items => {
      this.items = items;
    });
  }

  addItem(): void {
    if (this.newItem.name.trim()) {
      this.itemService.addItem(this.newItem).subscribe(item => {
        this.newItem.name = ''; // Clear the input field
      });
    }
  }

  editItem(item: any): void {
    const updatedName = prompt('Edit item name:', item.name);
    if (updatedName !== null && updatedName.trim()) {
      this.itemService.updateItem(item._id, { name: updatedName }).subscribe();
    }
  }

  deleteItem(id: string): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.itemService.deleteItem(id).subscribe();
    }
  }
}
