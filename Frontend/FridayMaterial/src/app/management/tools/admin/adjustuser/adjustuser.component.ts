import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs'
import { ShopUser } from 'src/app/models/models'
import { DialogService } from 'src/app/services/dialog.service'
import { SpinnerService } from 'src/app/services/spinner.service'
import { ToolService } from 'src/app/services/tool.service'

@Component({
  selector: 'friday-adjustuser',
  templateUrl: './adjustuser.component.html',
  styleUrls: ['./adjustuser.component.scss'],
})
export class AdjustuserComponent implements OnInit {
  selectedUser: ShopUser
  users: Observable<ShopUser[]>
  form: FormGroup
  newVal = 0

  constructor(
    private tool: ToolService,
    private spinner: SpinnerService,
    private dialog: DialogService,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      users: fb.control('', Validators.required),
      amount: fb.control(''),
      passwords: fb.group(
        {
          password: fb.control(''),
          passwordConfirm: fb.control(''),
        },
        { validator: this.passwordConfirming }
      ),
    })

    this.form.get('users').valueChanges.subscribe((s) => {
      this.selectedUser = s
      this.form.get('amount').setValue(this.selectedUser.balance)
      this.form.updateValueAndValidity()
    })

    this.form.get('amount').valueChanges.subscribe((s) => {
      this.newVal = +this.selectedUser.balance + +s
    })
  }

  ngOnInit(): void { }

  passwordConfirming(group: FormGroup): { invalid: boolean } {
    if (group.invalid) return { invalid: true }

    if (group.get('password').value !== group.get('passwordConfirm').value) {
      return { invalid: true }
    }
  }

  submit(): void {
    if (this.form.invalid) return

    const balance = this.form.get('amount').value
    const pass = this.form.get('passwords.password').value

    const balanceChanged = balance !== this.selectedUser.balance
    const passChanged = !!pass

    let balanceChangeDone = true
    let passChangeDone = true

    if (balanceChanged || passChanged) {

      this.spinner.startSpinner()

      // Check if balance is changed
      if (balanceChanged) {
        balanceChangeDone = false
        this.tool.adjustUserBalance(balance).subscribe(() => {
          balanceChangeDone = true
          if (balanceChangeDone && passChangeDone) this.spinner.stopSpinner(0)
        })
      }

      // Check if pass is changed
      if (passChanged) {
        passChangeDone = false
        this.tool.changePass(pass).subscribe(() => {
          passChangeDone = true
          if (balanceChangeDone && passChangeDone) this.spinner.stopSpinner(0)
        })
      }

    }
  }
}