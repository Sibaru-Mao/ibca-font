import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-tasksn-modal',
  templateUrl: './tasksn-modal.component.html',
  styleUrls: ['./tasksn-modal.component.css']
})
export class TasksnModalComponent implements OnInit {
  @Input() taskSn: string
  @Output() back = new EventEmitter<any>()
  constructor(private message: NzMessageService) { }

  ngOnInit(): void {
  }

  sure() {
    var oInput = document.createElement('input');
    oInput.value = this.taskSn;
    document.body.appendChild(oInput);
    oInput.select();
    document.execCommand("Copy");
    oInput.className = 'oInput';
    oInput.style.display = 'none';
    this.message.success('TaskSN复制成功')
    this.back.next()
  }

}
